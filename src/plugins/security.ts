import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import compress from '@fastify/compress';
export default fp(async (app) => {
  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute' });
  await app.register(compress);
});
