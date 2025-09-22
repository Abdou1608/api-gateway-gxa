import { SignJWT, jwtVerify, JWTPayload } from 'jose';

/**
 * Configuration interface for AuthService
 */
export interface AuthConfig {
  /** Default TTL for tokens in seconds (fallback if not provided per call) */
  defaultTtlSeconds?: number;
  /** Optional development secret (DO NOT ship production secrets in client bundles) */
  devSecret?: string;
}

// In a real Angular app this would be an InjectionToken<AuthConfig>.
// Here we expose a symbol placeholder to mirror that pattern without introducing Angular deps.
export const AUTH_CONFIG_TOKEN: unique symbol = Symbol('AUTH_CONFIG_TOKEN');

/**
 * A minimal shape of the JWT payload we create / consume.
 */
export interface SidPayload extends JWTPayload {
  sid: string;
}

/**
 * AuthService provides helper methods to sign and decode/verify JWTs using HS256.
 * Note: Client-side signing is NOT recommended for production security sensitive flows.
 * Always sign on a trusted backend when possible. This utility is primarily for
 * development or very low‑risk scenarios.
 */
export class AuthService {
  private readonly config: AuthConfig;

  constructor(config: AuthConfig = {}) {
    this.config = config;
  }

  /**
   * Create an HS256 signed JWT containing a sid claim.
   * @param key Secret used for HMAC (never hardcode production secrets) 
   * @param SID Session identifier to embed
   * @param ttlSeconds Time to live in seconds (default 900 or config.defaultTtlSeconds)
   */
  async get_token(key: string, SID: string, ttlSeconds?: number): Promise<string> {
    if (!key || key.trim().length === 0) {
      throw new Error('Secret key must be a non-empty string');
    }
    if (!SID || SID.trim().length === 0) {
      throw new Error('SID must be a non-empty string');
    }

    const ttl = typeof ttlSeconds === 'number' && ttlSeconds > 0
      ? ttlSeconds
      : (this.config.defaultTtlSeconds ?? 900);

    const secret = this.toSecret(key);

    const jwt = await new SignJWT({ sid: SID } as SidPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(`${ttl}s`)
      .sign(secret);

    return jwt;
  }

  /**
   * Extract SID from token. If key provided => verify signature.
   * If key omitted => decode without verification (best effort, unsafe for trust decisions).
   * Returns null for any invalid / unverifiable / malformed cases.
   */
  async get_SID(token: string, key?: string): Promise<string | null> {
    if (!token || token.split('.').length !== 3) {
      return null; // not a JWT compact form
    }

    if (key) {
      try {
        const secret = this.toSecret(key);
        const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
        const sidVal = (payload as SidPayload).sid;
        return typeof sidVal === 'string' ? sidVal : null;
      } catch (_err) {
        return null; // signature invalid, expired, malformed, etc.
      }
    }

    // Unsafe decode path (no signature check)
    try {
      const base64UrlPayload = token.split('.')[1];
      const json = this.base64UrlDecode(base64UrlPayload);
      const parsed: unknown = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null && 'sid' in parsed) {
        const sidVal = (parsed as Record<string, unknown>).sid;
        return typeof sidVal === 'string' ? sidVal : null;
      }
      return null;
    } catch (_e) {
      return null;
    }
  }

  /** Helper to transform a secret key string to Uint8Array */
  private toSecret(key: string): Uint8Array {
    return new TextEncoder().encode(key);
  }

  /** Base64URL decode helper (without atob dependency) */
  private base64UrlDecode(segment: string): string {
    // Replace URL-safe chars
    const b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    // Pad if needed
    const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
    const b64Padded = b64 + pad;
    const binary = Buffer.from(b64Padded, 'base64');
    return binary.toString('utf-8');
  }
}

export default AuthService;
