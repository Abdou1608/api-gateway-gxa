import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function buildErrorHandlers() {
  const setNotFound = (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
      requestId: (request as any).reqId,
    });
  };

  const setError = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const status = error.statusCode ?? 500;
    request.log.error({ err: error }, 'Unhandled error');
    reply.code(status).send({
      error: error.name || 'Error',
      message: error.message,
      requestId: (request as any).reqId,
    });
  };

  return { setNotFound, setError };
}
