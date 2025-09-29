import { NextFunction, Request, Response } from 'express';
import { BaseAppError, errorHttpStatus, InternalError } from '../common/errors';
import { toProblem } from '../errors/problem';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  const requestId = res.locals.requestId || (req as any).id || (req as any).requestId;
  const pd = toProblem(404, 'Not Found', `The requested resource ${req.originalUrl} was not found.`, { requestId });
  res.status(404).type('application/problem+json').json(pd);
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) { // eslint-disable-line
  const requestId = res.locals.requestId || (req as any).id || (req as any).requestId;
  const appErr: BaseAppError = err instanceof BaseAppError
    ? err
    : new InternalError(err?.message || 'Internal error');

  const status = errorHttpStatus(appErr);

  const detail = appErr.message;
  const title = appErr.type.replace(/_/g, ' ');
  const typeUri = appErr.type === 'SOAP_ERROR'
    ? 'about:blank#SOAP_ERROR'
    : appErr.type === 'UPSTREAM_TIMEOUT'
      ? 'about:blank#UPSTREAM_TIMEOUT'
      : 'about:blank#INTERNAL_ERROR';

  const pd = toProblem(status, title, detail, {
    requestId,
    code: appErr.code,
    errorType: appErr.type,
    details: appErr.details,
  });

  // Observability headers
  try { res.setHeader('X-Error-Type', appErr.type); } catch {}
  try { res.setHeader('X-Error-Code', appErr.code); } catch {}
  if (appErr.type === 'SOAP_ERROR') {
    try { res.setHeader('X-SOAP-FAULT', '1'); } catch {}
  }

  res.status(status).type('application/problem+json').json(pd);
}
