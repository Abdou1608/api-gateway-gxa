import type { Request, Response, NextFunction } from 'express';
import { isTokenRevoked } from '../auth/token-revocation.service';

const BEARER = /^Bearer\s+(.+)$/i;

export async function tokenRevocationPrecheck(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('authorization');
    const token = authHeader?.match(BEARER)?.[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    if (await isTokenRevoked(token)) return res.status(401).json({ error: 'Unauthorized' });
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
export default tokenRevocationPrecheck;
