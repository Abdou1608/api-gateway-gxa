import type { Request, Response, NextFunction } from 'express';
import AuthService from '../auth/auth.service';
import env from '../config/env';

const BEARER = /^Bearer\s+(.+)$/i;
const authService = new AuthService();

function extractToken(req: Request): string | undefined {
  const h = req.header('Authorization') ?? req.header('authorization');
  if (h) {
    const m = h.match(BEARER);
    if (m) return m[1];
  }
  if (req.session?.bearer) return req.session.bearer;
  if ((req as any).cookies?.auth_token) return (req as any).cookies.auth_token as string;
  if (process.env.NODE_ENV !== 'production' && typeof req.query.token === 'string') {
    return req.query.token;
  }
  return undefined;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized, Authentication needed to process' });
    }
    const key = process.env.JWS_KEY ?? env.jwtSecret ?? '';
    if (!key) {
      console.error('[authMiddleware] Missing JWS_KEY env');
      return res.status(503).json({ error: 'Server misconfiguration' });
    }
    const sid = await authService.get_SID(token, key);
    if (!sid) {
      return res.status(401).json({ error: 'Unauthorized, Authentication needed to process' });
    }
    req.auth = { sid, token };
    // Compatibility mapping for legacy validators expecting SessionID variants
    if (req.body && typeof req.body === 'object') {
      // Always enforce authoritative SID from JWT, ignoring any client supplied values.
      (req.body as any).SessionID = sid;
      (req.body as any)._SessionID = sid;
      (req.body as any).sessionId = sid;
      (req.body as any)._sessionId = sid;
      if (!(req.body as any).BasSecurityContext) {
        (req.body as any).BasSecurityContext = {};
      }
      (req.body as any).BasSecurityContext._SessionId = sid;
    }
    next();
  } catch (err) {
    console.warn('[authMiddleware] token invalid', err instanceof Error ? err.message : String(err));
    return res.status(401).json( { error: { detail: 'Unauthorized, Authentication needed to process', message: err instanceof Error ? err.message : String(err) } });
  }
}