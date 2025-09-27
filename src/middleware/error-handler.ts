import { NextFunction, Request, Response } from 'express';
import { BaseAppError, errorHttpStatus, InternalError } from '../common/errors';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  const now = new Date().toISOString();
  const requestId = res.locals.requestId || (req as any).requestId;
  res.status(404).json({
    error: {
      type: 'INTERNAL_ERROR',
      code: 'HTTP.NOT_FOUND',
      message: 'Not Found',
      details: { path: req.originalUrl },
      requestId,
      timestamp: now,
    }
  });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) { // eslint-disable-line
  const now = new Date().toISOString();
  const requestId = res.locals.requestId || (req as any).requestId;

  const appErr: BaseAppError = err instanceof BaseAppError
    ? err
    : new InternalError(err?.message || 'Internal error');

  const status = errorHttpStatus(appErr);
  const body: any = {
    error: {
      type: appErr.type,
      code: appErr.code,
      message: appErr.message,
      details: appErr.details,
      requestId,
      timestamp: now,
    }
  };

  // Observability headers (avoid leaking details)
  try { res.setHeader('X-Error-Type', appErr.type); } catch {}
  try { res.setHeader('X-Error-Code', appErr.code); } catch {}
  if (appErr.type === 'SOAP_ERROR') {
    try { res.setHeader('X-SOAP-FAULT', '1'); } catch {}
  }

  // Include stack in non-production to help debugging
  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    body.error.stack = err.stack;
  }

  res.status(status).json(body);
}
