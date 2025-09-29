import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const correlationPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('onRequest', async (request, reply) => {
    const hdr = request.headers['x-request-id'];
    const id = (Array.isArray(hdr) ? hdr[0] : hdr) || randomUUID();
    // Binder l’id sur le logger
    request.log = request.log.child({ reqId: id });
    (request as any).reqId = id;
    reply.header('X-Request-ID', id);
  });
};

/**
 * correlationId middleware
 * - Ensures every request has a stable req.id and x-request-id header
 * - Mirrors the value into res.locals.requestId and the response header
 */
export function correlationId(req: Request, res: Response, next: NextFunction) {
  const header = req.header('x-request-id') || req.header('X-Request-Id');
  const id = header && header.trim() !== '' ? header : randomUUID();
  (req as any).id = id;
  (req as any).requestId = id; // keep backward-compat with existing code
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
