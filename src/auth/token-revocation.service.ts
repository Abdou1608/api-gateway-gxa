import { createHash } from 'crypto';
import AuthService from './auth.service';
import { tokenRevocationsTotal, tokenRevocationChecksTotal } from '../observability/metrics';
import type { RedisClientType } from 'redis';

let redisClient: RedisClientType | undefined;
let redisInitPromise: Promise<void> | undefined;

async function getRedis(): Promise<RedisClientType | undefined> {
  if (!process.env.REDIS_URL) return undefined;
  if (redisClient) return redisClient;
  if (!redisInitPromise) {
    redisInitPromise = (async () => {
      const { createClient } = await import('redis');
      const client: RedisClientType = createClient({ url: process.env.REDIS_URL });
      client.on('error', (e) => {
        // Silent degrade to in-memory; do not throw
        redisClient = undefined;
      });
      await client.connect();
      redisClient = client;
    })();
  }
  try { await redisInitPromise; } catch { /* ignore */ }
  return redisClient;
}

/**
 * In-memory denylist entry.
 */
interface DenyEntry {
  exp: number; // epoch seconds
}

// Key = jti or sha256(token) when no jti.
const denyMap: Map<string, DenyEntry> = new Map();

// Lazy cleanup threshold (ms)
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000; // 1 min

const authService = new AuthService();

function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  for (const [k, v] of denyMap.entries()) {
    if (v.exp <= now / 1000) {
      denyMap.delete(k);
    }
  }
  lastSweep = now;
}

function tokenKey(token: string, payload: any): { key: string; exp?: number } {
  // Prefer standard JWT claims jti & exp
  const jti = payload?.jti as string | undefined;
  const exp = typeof payload?.exp === 'number' ? payload.exp : undefined;
  if (jti) return { key: jti, exp };
  // Fallback: hash the full token (do NOT log it)
  const key = createHash('sha256').update(token).digest('hex');
  return { key, exp };
}

/**
 * Adds a token to the denylist (idempotent). If token has no exp, sets a short TTL (5 min) to avoid unbounded growth.
 * TODO: Replace in-memory Map with Redis / distributed cache for multi-instance deployments.
 */
export async function invalidateToken(token: string): Promise<void> {
  const now = Date.now();
  sweepExpired(now);
  // We only need partial decode (no need for verified claims for jti/exp usage if already validated upstream)
  const keyMaterial = await safeDecode(token);
  const { key, exp } = tokenKey(token, keyMaterial?.payload || {});
  const effectiveExp = exp ?? Math.floor(now / 1000) + 900; // 5 minutes fallback
  const r = await getRedis();
  if (r) {
    const ttl = effectiveExp - Math.floor(now / 1000);
    if (ttl > 0) {
      const setRes = await r.set(`revoked:${key}`, '1', { EX: ttl, NX: true });
      await r.pfAdd('revoked:hll', key);
      if (setRes === 'OK') {
        tokenRevocationsTotal.inc({ backend: 'redis', reason: 'manual' });
      }
    }
    return;
  }
  if (!denyMap.has(key)) {
    denyMap.set(key, { exp: effectiveExp });
    tokenRevocationsTotal.inc({ backend: 'memory', reason: 'manual' });
  }
}

/**
 * Checks whether a token is revoked (and not yet expired). Performs lazy cleanup.
 */
export async function isTokenRevoked(token: string): Promise<boolean> {
  const now = Date.now();
  sweepExpired(now);
  const keyMaterial = await safeDecode(token);
  const { key } = tokenKey(token, keyMaterial?.payload || {});
  const r = await getRedis();
  if (r) {
    const exists = await r.exists(`revoked:${key}`);
    const revoked = exists === 1;
    tokenRevocationChecksTotal.inc({ backend: 'redis', result: revoked ? 'revoked' : 'ok' });
    return revoked;
  }
  const entry = denyMap.get(key);
  if (!entry) {
    tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'ok' });
    return false;
  }
  if (entry.exp <= now / 1000) {
    denyMap.delete(key); // expired -> cleanup
    tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'ok' });
    return false;
  }
  tokenRevocationChecksTotal.inc({ backend: 'memory', result: 'revoked' });
  return true;
}

export async function getRevocationMetrics(): Promise<{ backend: 'redis' | 'memory'; entries: number }> {
  const r = await getRedis();
  if (r) {
    const count = await r.pfCount('revoked:hll');
    return { backend: 'redis', entries: count };
  }
  return { backend: 'memory', entries: denyMap.size };
}

export function getMemoryRevokedCount(): number {
  return denyMap.size;
}

/**
 * Attempts a lightweight verification / decode to extract claims. Falls back silently if fails.
 */
async function safeDecode(token: string): Promise<{ payload: any } | undefined> {
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
  } catch {
    // ignore
  }
  // Fallback: attempt raw base64 decode without trust (still acceptable for jti/exp retrieval)
  try {
    const payloadPart = token.split('.')[1];
    if (payloadPart) {
      const json = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
      return { payload: json };
    }
  } catch {
    // ignore
  }
  return undefined;
}
