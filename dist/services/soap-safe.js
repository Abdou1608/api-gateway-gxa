"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSoapWithResilience = callSoapWithResilience;
const errors_1 = require("../common/errors");
const TIMEOUT_MS = Number(process.env.SOAP_TIMEOUT_MS || '15000') || 15000;
const RETRIES = Number(process.env.SOAP_RETRIES || '2') || 2;
const BACKOFF_MS = Number(process.env.SOAP_BACKOFF_MS || '400') || 400;
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
async function callSoapWithResilience(client, action, options) {
    const timeoutMs = options?.timeoutMs ?? TIMEOUT_MS;
    const retries = options?.retries ?? RETRIES;
    const backoffMs = options?.backoffMs ?? BACKOFF_MS;
    let attempt = 0;
    let lastErr = null;
    while (attempt <= retries) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            // Note: BasSoapClient doesn't support signal directly; rely on timeouts via Promise race
            const result = await Promise.race([
                action(),
                new Promise((_, reject) => setTimeout(() => reject(new errors_1.UpstreamTimeoutError('SOAP_TIMEOUT')), timeoutMs)),
            ]);
            clearTimeout(timer);
            return result;
        }
        catch (e) {
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
    throw lastErr || new errors_1.UpstreamTimeoutError('SOAP request failed');
}
