import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import config from '../config/env';

// Very simple HMAC based token check (placeholder). Expect token == HMAC(secret, 'payload').
function verifyToken(token: string): { sub: string } | null {
  const expected = crypto.createHmac('sha256', config.jwtSecret).update('payload').digest('hex');
  if (token === expected) return { sub: 'demo' };
  return null;
}

export function jwtAuth(optional = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      if (optional) return next();
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = auth.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      if (optional) return next();
      return res.status(401).json({ error: 'Invalid token' });
    }
    (req as any).user = payload;
    next();
  };
}
