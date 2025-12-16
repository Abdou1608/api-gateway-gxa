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
exports.invalidateToken = invalidateToken;
exports.isTokenRevoked = isTokenRevoked;
exports.getRevocationMetrics = getRevocationMetrics;
exports.getMemoryRevokedCount = getMemoryRevokedCount;
const crypto_1 = require("crypto");
const auth_service_1 = __importDefault(require("./auth.service"));
const metrics_1 = require("../observability/metrics");
let redisClient;
let redisInitPromise;
async function getRedis() {
    if (!process.env.REDIS_URL)
        return undefined;
    if (redisClient)
        return redisClient;
    if (!redisInitPromise) {
        redisInitPromise = (async () => {
            const { createClient } = await Promise.resolve().then(() => __importStar(require('redis')));
            const client = createClient({ url: process.env.REDIS_URL });
            client.on('error', (e) => {
                // Silent degrade to in-memory; do not throw
                redisClient = undefined;
            });
            await client.connect();
            redisClient = client;
        })();
    }
    try {
        await redisInitPromise;
    }
    catch { /* ignore */ }
    return redisClient;
}
// Key = jti or sha256(token) when no jti.
const denyMap = new Map();
// Lazy cleanup threshold (ms)
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000; // 1 min
const authService = new auth_service_1.default();
function sweepExpired(now) {
    if (now - lastSweep < SWEEP_INTERVAL_MS)
        return;
    for (const [k, v] of denyMap.entries()) {
        if (v.exp <= now / 1000) {
            denyMap.delete(k);
        }
    }
    lastSweep = now;
}
function tokenKey(token, payload) {
    // Prefer standard JWT claims jti & exp
    const jti = payload?.jti;
    const exp = typeof payload?.exp === 'number' ? payload.exp : undefined;
    if (jti)
        return { key: jti, exp };
    // Fallback: hash the full token (do NOT log it)
    const key = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    return { key, exp };
}
/**
 * Adds a token to the denylist (idempotent). If token has no exp, sets a short TTL (5 min) to avoid unbounded growth.
 * TODO: Replace in-memory Map with Redis / distributed cache for multi-instance deployments.
 */
async function invalidateToken(token) {
    const now = Date.now();
    sweepExpired(now);
    // We only need partial decode (no need for verified claims for jti/exp usage if already validated upstream)
    const keyMaterial = await safeDecode(token);
    const { key, exp } = tokenKey(token, keyMaterial?.payload || {});
    const effectiveExp = exp ?? Math.floor(now / 1000) + (24 * 60 * 60); // 24 hours fallback
    const r = await getRedis();
    if (r) {
        const ttl = effectiveExp - Math.floor(now / 1000);
        if (ttl > 0) {
            const setRes = await r.set(`revoked:${key}`, '1', { EX: ttl, NX: true });
            await r.pfAdd('revoked:hll', key);
            if (setRes === 'OK') {
                metrics_1.tokenRevocationsTotal.inc({ backend: 'redis', reason: 'manual' });
            }
        }
        return;
    }
    if (!denyMap.has(key)) {
        denyMap.set(key, { exp: effectiveExp });
        metrics_1.tokenRevocationsTotal.inc({ backend: 'memory', reason: 'manual' });
    }
}
/**
 * Checks whether a token is revoked (and not yet expired). Performs lazy cleanup.
 */
async function isTokenRevoked(token) {
    const now = Date.now();
    sweepExpired(now);
    const keyMaterial = await safeDecode(token);
    const { key } = tokenKey(token, keyMaterial?.payload || {});
    const r = await getRedis();
    if (r) {
        const exists = await r.exists(`revoked:${key}`);
        const revoked = exists === 1;
        metrics_1.tokenRevocationChecksTotal.inc({ backend: 'redis', result: revoked ? 'revoked' : 'ok' });
        return revoked;
    }
    const entry = denyMap.get(key);
    if (!entry) {
        metrics_1.tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'ok' });
        return false;
    }
    if (entry.exp <= now / 1000) {
        denyMap.delete(key); // expired -> cleanup
        metrics_1.tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'ok' });
        return false;
    }
    metrics_1.tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'revoked' });
    return true;
}
async function getRevocationMetrics() {
    const r = await getRedis();
    if (r) {
        const count = await r.pfCount('revoked:hll');
        return { backend: 'redis', entries: count };
    }
    return { backend: 'memory', entries: denyMap.size };
}
function getMemoryRevokedCount() {
    return denyMap.size;
}
/**
 * Attempts a lightweight verification / decode to extract claims. Falls back silently if fails.
 */
async function safeDecode(token) {
    try {
        // Try full verification first to leverage signature check (needs key)
        const key = process.env.JWS_KEY || '';
        if (key) {
            const sid = await authService.get_SID(token, key); // ensures token structure valid; we don't expose sid here
            if (sid) {
                // We *could* parse with atob split logic, but since we already trust signature, just decode payload part.
                const payloadPart = token.split('.')[1];
                if (payloadPart) {
                    const json = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
                    return { payload: json };
                }
            }
        }
    }
    catch {
        // ignore
    }
    // Fallback: attempt raw base64 decode without trust (still acceptable for jti/exp retrieval)
    try {
        const payloadPart = token.split('.')[1];
        if (payloadPart) {
            const json = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
            return { payload: json };
        }
    }
    catch {
        // ignore
    }
    return undefined;
}
