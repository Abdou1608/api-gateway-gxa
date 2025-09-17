import { NextFunction, Request, Response } from 'express';

// Central application error representation
export class AppError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) { // eslint-disable-line
  const status = err instanceof AppError ? err.status : 500;
  const payload: any = {
    error: err.message || 'Internal Server Error',
  };
  if (err.details) payload.details = err.details;
  // Ajout d'un header d'observabilité si c'est une fault SOAP normalisée
  if (err.details && (err.details.faultcode || err.details.errorCode)) {
    try { res.setHeader('X-SOAP-FAULT', '1'); } catch { /* ignore */ }
    if (err.details.errorCode) {
      try { res.setHeader('X-ERROR-CODE', String(err.details.errorCode)); } catch { /* ignore */ }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}
