import { BasSoapClient } from '../Model/Model-BasSoapClient/BasSoapClient';
import { UpstreamTimeoutError } from '../common/errors';

export interface SoapResilienceOptions {
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
}

const TIMEOUT_MS = Number(process.env.SOAP_TIMEOUT_MS || '15000') || 15000;
const RETRIES = Number(process.env.SOAP_RETRIES || '2') || 2;
const BACKOFF_MS = Number(process.env.SOAP_BACKOFF_MS || '400') || 400;

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export async function callSoapWithResilience<T>(
  client: BasSoapClient,
  action: () => Promise<T>,
  options?: SoapResilienceOptions
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? TIMEOUT_MS;
  const retries = options?.retries ?? RETRIES;
  const backoffMs = options?.backoffMs ?? BACKOFF_MS;

  let attempt = 0;
  let lastErr: any = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // Note: BasSoapClient doesn't support signal directly; rely on timeouts via Promise race
      const result = await Promise.race([
        action(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new UpstreamTimeoutError('SOAP_TIMEOUT')), timeoutMs)),
      ]);
      clearTimeout(timer);
      return result as T;
    } catch (e: any) {
      clearTimeout(timer);
      lastErr = e;
      const msg = String(e?.message || '').toLowerCase();
      const isTimeout = msg.includes('soap_timeout') || msg.includes('timeout');
      const isSessionMissing = msg.includes('session not found');

      if (attempt < retries && (isTimeout || isSessionMissing)) {
        const delay = backoffMs * Math.pow(2, attempt);
        await sleep(delay);
        attempt++;
        continue;
      }
      throw e;
    }
  }

  throw lastErr || new UpstreamTimeoutError('SOAP request failed');
}
