import type { Request, Response, NextFunction } from 'express';
import AuthService from '../auth/auth.service';

const BEARER = /^Bearer\s+(.+)$/i;
const authService = new AuthService();

function extractToken(req: Request): string | undefined {
  const h = req.header('authorization');
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
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = process.env.JWS_KEY;
    if (!key) {
      console.error('[authMiddleware] Missing JWS_KEY env');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }
    const sid = await authService.get_SID(token, key);
    if (!sid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.auth = { sid, token };
    // Compatibility mapping for legacy validators expecting SessionID variants
    if (req.body && typeof req.body === 'object') {
      (req.body as any).SessionID ??= sid;
      (req.body as any)._SessionID ??= sid;
      (req.body as any).sessionId ??= sid;
      (req.body as any)._sessionId ??= sid;
    }
    next();
  } catch (err) {
    console.warn('[authMiddleware] token invalid', err instanceof Error ? err.message : String(err));
    return res.status(401).json({ error: 'Unauthorized' });
  }
}