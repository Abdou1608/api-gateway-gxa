import { randomUUID } from 'crypto';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { BaseAppError, errorHttpStatus } from '../common/errors';

function resolveRequestId(request: FastifyRequest, reply: FastifyReply): string {
  return (
    (request as any).reqId ||
    request.id ||
    (reply.getHeader('X-Request-ID') as string | undefined) ||
    (request.headers['x-request-id'] as string | undefined) ||
    randomUUID()
  );
}

export function buildErrorHandlers() {
  const setNotFound = (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
      requestId: (request as any).reqId,
    });
  };

  const setError = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const reqId = resolveRequestId(request, reply);
    const maybeAppError = (error instanceof BaseAppError) || (typeof (error as any)?.type === 'string' && typeof (error as any)?.code === 'string');
    if (maybeAppError) {
      const typedError = error as BaseAppError;
      const domainType = (typedError as any).errorType ?? typedError.type;
      const status = (typedError as any).statusCode ?? errorHttpStatus(typedError);
      request.log.warn({ err: error, reqId }, 'Handled application error');
      reply
        .header('X-Request-ID', reqId)
        .header('Content-Type', 'application/problem+json')
        .header('X-Error-Type', domainType)
        .header('X-Error-Code', typedError.code)
        .code(status)
        .send({
          status,
          errorType: domainType,
          code: typedError.code,
          detail: typedError.message,
          requestId: reqId,
          ...(typedError.details ? { details: typedError.details } : {}),
        });
      return;
    }

    const status = error.statusCode ?? 500;
    request.log.error({ err: error }, 'Unhandled error');
    reply
      .header('X-Request-ID', reqId)
      .code(status).send({
      error: error.name || 'Error',
      message: error.message,
      requestId: reqId,
    });
  };

  return { setNotFound, setError };
}
