import type { FastifyInstance } from 'fastify';
export default async function routes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/readiness', async () => ({ ready: true }));
}
