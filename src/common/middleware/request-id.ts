import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const fromHeader = req.header('x-request-id');
  const id = fromHeader && fromHeader.trim() !== '' ? fromHeader : randomUUID();
  (req as any).requestId = id;
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
