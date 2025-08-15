import type { FastifyInstance } from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { verifyJwt } from '../auth/jwt';
export default async function routes(app: FastifyInstance) {
  await app.register(httpProxy, { upstream: app.config.BROKER_SERVICE_URL, prefix: '/api/brokers', rewritePrefix: '/' });
  app.addHook('onRequest', async (req, reply) => {
    const user = verifyJwt(req);
    if (!user) return reply.status(401).send({ message: 'Unauthorized' });
    (req as any).user = user;
  });
}
