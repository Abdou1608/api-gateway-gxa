import { createHash } from 'crypto';
import AuthService from './auth.service';

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
  if (!denyMap.has(key)) {
    const effectiveExp = exp ?? Math.floor(now / 1000) + 300; // 5 minutes fallback
    denyMap.set(key, { exp: effectiveExp });
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
  const entry = denyMap.get(key);
  if (!entry) return false;
  if (entry.exp <= now / 1000) {
    denyMap.delete(key); // expired -> cleanup
    return false;
  }
  return true;
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
