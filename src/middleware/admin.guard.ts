import type { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const configured = process.env.ADMIN_SECRET;
  if (!configured) return res.status(503).json({ error: 'Admin secret not configured' });
  const provided = req.header('x-admin-secret') || '';
  if (!safeCompare(provided, configured)) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

export default adminGuard;
