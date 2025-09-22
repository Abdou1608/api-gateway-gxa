# AuthService JWT Utilities

This document describes the lightweight JWT helper (`AuthService`) added to the gateway.

> IMPORTANT: Client-side signing of JWTs with a shared secret is NOT recommended for production security boundaries. Always prefer server-side issuance.

## Features

- HS256 signing using [`jose`](https://github.com/panva/jose) (WebCrypto native in Node 20+)
- Minimal payload: `{ sid, iat, exp }`
- Configurable TTL (default 900s) via constructor `AuthConfig`
- Safe verification path (`get_SID(token, key)`) returning `null` instead of throwing
- Best‑effort decode path without signature verification (`get_SID(token)`) for non‑sensitive reads
- Strict TypeScript, no implicit `any`

## API

```ts
class AuthService {
  constructor(config?: AuthConfig);
  get_token(key: string, SID: string, ttlSeconds?: number): Promise<string>;
  get_SID(token: string, key?: string): Promise<string | null>;
}

interface AuthConfig {
  defaultTtlSeconds?: number; // default expiration if not provided per call
  devSecret?: string;         // NEVER bundle production secrets
}
```

### get_token
Creates an HS256 JWT.
- Validates inputs (non‑empty `key`, `SID`).
- Uses provided `ttlSeconds` or `config.defaultTtlSeconds` or 900.
- Returns the compact serialized token (`header.payload.signature`).

### get_SID
Extracts the `sid` claim.
- With `key`: verifies signature + expiration via `jwtVerify`; returns `sid` or `null`.
- Without `key`: decodes payload without verification (unsafe for trust decisions) and returns `sid` or `null`.
- All errors (malformed, expired, invalid signature) are mapped to `null`.

## Usage

```ts
import AuthService from '../src/auth/auth.service';

const auth = new AuthService({ defaultTtlSeconds: 600 });
const secret = process.env.DEV_JWT_SECRET!; // DO NOT hardcode
const sid = 'user-session-123';

// Sign
const token = await auth.get_token(secret, sid);

// Verify + extract
const verifiedSid = await auth.get_SID(token, secret); // 'user-session-123'

// Decode only (no signature verification)
const decodedSid = await auth.get_SID(token); // 'user-session-123'
```

## Security Notes

| Concern | Guidance |
|---------|----------|
| Secret exposure | Never commit or embed real production secrets in frontend bundles. |
| Client-side signing | Suitable only for prototypes, local dev, or non‑sensitive ephemeral assertions. |
| Token trust | Only treat `get_SID(token)` (no key) as a convenience decode; do not authorize from it. |
| Replay | Add additional claims (nonce, audience, issuer) and server-side tracking for stronger control. |
| Rotation | Implement secret rotation (multiple valid keys) if used beyond dev. |

## Extensibility Ideas
- Add `aud`, `iss`, `sub` claims enforcement.
- Support multiple algorithms via config.
- Integrate with a central secret provider / KMS.
- Add refresh token flow (server-mediated).

## Testing
See `tests/auth.service.test.ts` for coverage:
- Generates a 3‑segment JWT.
- Verifies valid token.
- Decodes without key.
- Handles invalid format, wrong key, tampering.

## Placeholder Injection Token
`AUTH_CONFIG_TOKEN` (unique symbol) stands in for an Angular `InjectionToken<AuthConfig>` should this code be migrated into an Angular workspace. Replace with:

```ts
export const AUTH_CONFIG_TOKEN = new InjectionToken<AuthConfig>('AUTH_CONFIG');
```

in an Angular context, and provide config in an `@NgModule` / standalone provider.

## Disclaimer
This helper is intentionally minimal and not a substitute for a hardened authentication / authorization system.
