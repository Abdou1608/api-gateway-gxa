"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasSoapClient = void 0;
const axios_1 = __importDefault(require("axios"));
const BasSoapFault_1 = require("../BasSoapObject/BasSoapFault");
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const opensession_1 = require("../../services/login/opensession");
const pending_queue_1 = require("../../utils/pending-queue");
const soap_audit_1 = require("../../observability/soap-audit");
const metrics_1 = require("../../observability/metrics");
// single-flight guard per-tenant (owner/domain) to prevent stampede
const inflightReopens = new Map();
function tenantKey(ctx) {
    const o = ctx?.userId || 'unknown';
    const d = ctx?.domain || 'unknown';
    return `${o}@@${d}`;
}
async function reopenSessionOnce(ctx) {
    if (!ctx?.userId)
        return; // nothing we can do
    const key = tenantKey(ctx);
    const existing = inflightReopens.get(key);
    if (existing) {
        await existing;
        return;
    }
    const labels = { owner: ctx.userId || 'unknown', domain: ctx.domain || 'unknown' };
    metrics_1.soapSessionReopenAttemptsTotal.inc(labels);
    const p = (async () => {
        try {
            await (0, opensession_1.opensession)(ctx.userId, ctx.password || '', ctx.domain);
            metrics_1.soapSessionReopenSuccessTotal.inc(labels);
        }
        catch (e) {
            metrics_1.soapSessionReopenFailuresTotal.inc(labels);
            throw e;
        }
        finally {
            inflightReopens.delete(key);
        }
    })();
    inflightReopens.set(key, p);
    await p;
}
class BasSoapClient {
    constructor() {
        this.SoapHeader = '';
        this.SoapFooter = '';
        this.SoapHeader = '';
        this.SoapFooter = '';
    }
    async getFileContent(file) {
        const filePath = path.resolve(file);
        return await fs.readFile(filePath, 'utf-8');
    }
    headerAndFooterNotLoaded() {
        return this.SoapFooter === '' || this.SoapHeader === '';
    }
    async loadHeaderAndFooter() {
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
    async soapRequest(url, request, ctx) {
        if (this.headerAndFooterNotLoaded()) {
            await this.loadHeaderAndFooter();
        }
        const soapEnvelope = this.SoapHeader + request + this.SoapFooter;
        const doPost = async () => {
            const response = await axios_1.default.post(url, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                },
                responseType: 'text',
            });
            // Centralisation: on laisse handleSoapResponse détecter et lever une AppError au besoin
            const safeXml = (0, soap_fault_handler_1.handleSoapResponse)(response.data, logger_1.default);
            return safeXml;
        };
        try {
            return await doPost();
        }
        catch (error) {
            // Essayons d'identifier un fault "session not found" à partir de différents formats d'erreur
            const payload = (error?.response?.data ?? error?.response) || error?.rawXml || error?.soap || error?.message || '';
            const lower = String(payload).toLowerCase();
            const looksLikeFault = BasSoapFault_1.BasSoapFault.IsBasError(payload) || lower.includes('<fault') || lower.includes('soap-env:fault') || lower.includes('session not found');
            if (looksLikeFault) {
                // If plain message contains session not found -> retry directly
                if (lower.includes('session not found') && ctx?.userId) {
                    logger_1.default.warn(`[SOAP] Session not found (msg) → retry openSession for user=${ctx.userId} domain=${ctx.domain ?? '-'} queue=${pending_queue_1.PendingQueue.size()} [${pending_queue_1.PendingQueue.formatSnapshot()}]`);
                    const auditStart = Date.now();
                    try {
                        await reopenSessionOnce(ctx);
                        logger_1.default.info(`[SOAP] openSession success → retrying original request for user=${ctx.userId} domain=${ctx.domain ?? '-'}`);
                        const xml = await doPost();
                        const end = Date.now();
                        // Optional audit record for the reopen event only
                        try {
                            await soap_audit_1.SoapAudit.init();
                            soap_audit_1.SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: 'reopen+retry ok' });
                        }
                        catch { }
                        return xml;
                    }
                    catch (err) {
                        const end = Date.now();
                        const errMsg = (err && err.message) ? String(err.message) : String(err);
                        try {
                            await soap_audit_1.SoapAudit.init();
                            soap_audit_1.SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: 'reopen.failed', errorMessage: errMsg });
                        }
                        catch { }
                        throw err;
                    }
                }
                // Otherwise, try to normalize via handler and inspect thrown message
                try {
                    (0, soap_fault_handler_1.handleSoapResponse)(typeof payload === 'string' ? payload : String(payload), logger_1.default);
                }
                catch (e) {
                    const msg = String(e?.message || '').toLowerCase();
                    const isSessionNotFound = msg.includes('session not found');
                    if (isSessionNotFound && ctx?.userId) {
                        logger_1.default.warn(`[SOAP] Session not found → retry openSession for user=${ctx.userId} domain=${ctx.domain ?? '-'} queue=${pending_queue_1.PendingQueue.size()} [${pending_queue_1.PendingQueue.formatSnapshot()}]`);
                        const auditStart = Date.now();
                        try {
                            await reopenSessionOnce(ctx);
                            logger_1.default.info(`[SOAP] openSession success → retrying original request for user=${ctx.userId} domain=${ctx.domain ?? '-'}`);
                            const xml = await doPost();
                            const end = Date.now();
                            try {
                                await soap_audit_1.SoapAudit.init();
                                soap_audit_1.SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: 'reopen+retry ok' });
                            }
                            catch { }
                            return xml;
                        }
                        catch (err) {
                            const end = Date.now();
                            const errMsg = (err && err.message) ? String(err.message) : String(err);
                            try {
                                await soap_audit_1.SoapAudit.init();
                                soap_audit_1.SoapAudit.record({ id: 0, action: 'SESSION_REOPEN', owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: 'reopen.failed', errorMessage: errMsg });
                            }
                            catch { }
                            throw err;
                        }
                    }
                    throw e;
                }
            }
            throw error; // Pas une fault SOAP -> propager l'erreur axios originale
        }
    }
    async soapVoidRequest(url, request, ctx) {
        if (this.headerAndFooterNotLoaded()) {
            await this.loadHeaderAndFooter();
        }
        const soapEnvelope = this.SoapHeader + request + this.SoapFooter;
        const doPost = async () => {
            const response = await axios_1.default.post(url, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                },
                responseType: 'text',
            });
            if (response.status === 200 && response.data) {
                (0, soap_fault_handler_1.handleSoapResponse)(response.data, logger_1.default);
            }
        };
        try {
            await doPost();
        }
        catch (error) {
            const payload = (error?.response?.data ?? error?.response) || error?.rawXml || error?.soap || error?.message || '';
            const lower = String(payload).toLowerCase();
            const looksLikeFault = BasSoapFault_1.BasSoapFault.IsBasError(payload) || lower.includes('<fault') || lower.includes('soap-env:fault') || lower.includes('session not found');
            if (looksLikeFault) {
                if (lower.includes('session not found') && ctx?.userId) {
                    await reopenSessionOnce(ctx);
                    await doPost();
                    return;
                }
                try {
                    (0, soap_fault_handler_1.handleSoapResponse)(typeof payload === 'string' ? payload : String(payload), logger_1.default);
                }
                catch (e) {
                    const msg = String(e?.message || '').toLowerCase();
                    const isSessionNotFound = msg.includes('session not found');
                    if (isSessionNotFound && ctx?.userId) {
                        try {
                            await reopenSessionOnce(ctx);
                            await doPost();
                            return;
                        }
                        catch {
                            throw e;
                        }
                    }
                    throw e;
                }
            }
            throw error;
        }
    }
}
exports.BasSoapClient = BasSoapClient;
