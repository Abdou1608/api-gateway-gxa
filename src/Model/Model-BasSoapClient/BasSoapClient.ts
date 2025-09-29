import axios, { AxiosResponse } from 'axios';
import { BasSoapFault } from '../BasSoapObject/BasSoapFault';
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { opensession } from '../../services/login/opensession';
import { PendingQueue } from '../../utils/pending-queue';
import { SoapAudit } from '../../observability/soap-audit';
import { soapSessionReopenAttemptsTotal, soapSessionReopenFailuresTotal, soapSessionReopenSuccessTotal } from '../../observability/metrics';

// single-flight guard per-tenant (owner/domain) to prevent stampede
const inflightReopens = new Map<string, Promise<void>>();
function tenantKey(ctx?: { userId?: string; domain?: string }): string {
  const o = ctx?.userId || 'unknown';
  const d = ctx?.domain || 'unknown';
  return `${o}@@${d}`;
}
async function reopenSessionOnce(ctx?: { userId?: string; password?: string; domain?: string }) {
  if (!ctx?.userId) return; // nothing we can do
  const key = tenantKey(ctx);
  const existing = inflightReopens.get(key);
  if (existing) { await existing; return; }
  const labels = { owner: ctx.userId || 'unknown', domain: ctx.domain || 'unknown' } as const;
  soapSessionReopenAttemptsTotal.inc(labels);
  const p = (async () => {
    try {
      await opensession(ctx.userId!, ctx.password || '', ctx.domain);
      soapSessionReopenSuccessTotal.inc(labels);
    } catch (e) {
      soapSessionReopenFailuresTotal.inc(labels);
      throw e;
    } finally {
      inflightReopens.delete(key);
    }
  })();
  inflightReopens.set(key, p);
  await p;
}

export class BasSoapClient {
  private SoapHeader = '';
  private SoapFooter = '';

  constructor() {
    this.SoapHeader = '';
    this.SoapFooter = '';
  }

  async getFileContent(file: string): Promise<string> {
    const filePath = path.resolve(file);
    return await fs.readFile(filePath, 'utf-8');
  }

  private headerAndFooterNotLoaded(): boolean {
    return this.SoapFooter === '' || this.SoapHeader === '';
  }

  private async loadHeaderAndFooter(): Promise<void> {
    this.SoapHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
    this.SoapHeader += `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"`;
    this.SoapHeader += ` xmlns:ns1="http://belair-info.com/bas/services"`;
    this.SoapHeader += ` xmlns:xsd="http://www.w3.org/2001/XMLSchema"`;
    this.SoapHeader += ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`;
    this.SoapHeader += ` xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"`;
    this.SoapHeader += ` SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">`;
    this.SoapHeader += `<SOAP-ENV:Body>`;
    this.SoapFooter = `</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
  }

  async soapRequest(url: string, request: string, ctx?: { userId?: string; domain?: string; password?: string }): Promise<string> {
    if (this.headerAndFooterNotLoaded()) {
      await this.loadHeaderAndFooter();
    }

    const soapEnvelope = this.SoapHeader + request + this.SoapFooter;

    const doPost = async (): Promise<string> => {
      const response: AxiosResponse<string> = await axios.post(url, soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
        },
        responseType: 'text',
      });

      // Centralisation: on laisse handleSoapResponse détecter et lever une AppError au besoin
      const safeXml = handleSoapResponse(response.data, logger);
      return safeXml;
    };

    try {
      return await doPost();
    } catch (error: any) {
      // Essayons d'identifier un fault "session not found" à partir de différents formats d'erreur
      const payload = (error?.response?.data ?? error?.response) || error?.rawXml || error?.soap || error?.message || '';
      const lower = String(payload).toLowerCase();
      const looksLikeFault = BasSoapFault.IsBasError(payload) || lower.includes('<fault') || lower.includes('soap-env:fault') || lower.includes('session not found');

      if (looksLikeFault) {
        // If plain message contains session not found -> retry directly
        if (lower.includes('session not found') && ctx?.userId) {
          logger.warn(`[SOAP] Session not found (msg) → retry openSession for user=${ctx.userId} domain=${ctx.domain ?? '-'} queue=${PendingQueue.size()} [${PendingQueue.formatSnapshot()}]`);
          const auditStart = Date.now();
          try {
            await reopenSessionOnce(ctx);
            logger.info(`[SOAP] openSession success → retrying original request for user=${ctx.userId} domain=${ctx.domain ?? '-'}`);
            const xml = await doPost();
            const end = Date.now();
            // Optional audit record for the reopen event only
            try { await SoapAudit.init(); SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: 'reopen+retry ok' }); } catch {}
            return xml;
          } catch (err) {
            const end = Date.now();
            const errMsg = (err && (err as any).message) ? String((err as any).message) : String(err);
            try { await SoapAudit.init(); SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: 'reopen.failed', errorMessage: errMsg }); } catch {}
            throw err;
          }
        }
        // Otherwise, try to normalize via handler and inspect thrown message
        try {
          handleSoapResponse(typeof payload === 'string' ? payload : String(payload), logger);
        } catch (e: any) {
          const msg = String(e?.message || '').toLowerCase();
          const isSessionNotFound = msg.includes('session not found');
          if (isSessionNotFound && ctx?.userId) {
            logger.warn(`[SOAP] Session not found → retry openSession for user=${ctx.userId} domain=${ctx.domain ?? '-'} queue=${PendingQueue.size()} [${PendingQueue.formatSnapshot()}]`);
            const auditStart = Date.now();
            try {
              await reopenSessionOnce(ctx);
              logger.info(`[SOAP] openSession success → retrying original request for user=${ctx.userId} domain=${ctx.domain ?? '-'}`);
              const xml = await doPost();
              const end = Date.now();
              try { await SoapAudit.init(); SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: 'reopen+retry ok' }); } catch {}
              return xml;
            } catch (err) {
              const end = Date.now();
              const errMsg = (err && (err as any).message) ? String((err as any).message) : String(err);
              try { await SoapAudit.init(); SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: 'reopen.failed', errorMessage: errMsg }); } catch {}
              throw err;
            }
          }
          throw e;
        }
      }
      throw error; // Pas une fault SOAP -> propager l'erreur axios originale
    }
  }

  async soapVoidRequest(url: string, request: string, ctx?: { userId?: string; domain?: string; password?: string }): Promise<void> {
    if (this.headerAndFooterNotLoaded()) {
      await this.loadHeaderAndFooter();
    }

    const soapEnvelope = this.SoapHeader + request + this.SoapFooter;

    const doPost = async (): Promise<void> => {
      const response: AxiosResponse<string> = await axios.post(url, soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
        },
        responseType: 'text',
      });

      if (response.status === 200 && response.data) {
        handleSoapResponse(response.data, logger);
      }
    };

    try {
      await doPost();
    } catch (error: any) {
      const payload = (error?.response?.data ?? error?.response) || error?.rawXml || error?.soap || error?.message || '';
      const lower = String(payload).toLowerCase();
      const looksLikeFault = BasSoapFault.IsBasError(payload) || lower.includes('<fault') || lower.includes('soap-env:fault') || lower.includes('session not found');
      if (looksLikeFault) {
        if (lower.includes('session not found') && ctx?.userId) {
          await reopenSessionOnce(ctx); await doPost(); return;
        }
        try { handleSoapResponse(typeof payload === 'string' ? payload : String(payload), logger); }
        catch (e: any) {
          const msg = String(e?.message || '').toLowerCase();
          const isSessionNotFound = msg.includes('session not found');
          if (isSessionNotFound && ctx?.userId) {
            try { await reopenSessionOnce(ctx); await doPost(); return; }
            catch { throw e; }
          }
          throw e;
        }
      }
      throw error;
    }
  }
}
