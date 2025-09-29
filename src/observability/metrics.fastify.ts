import type { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { registry, httpRequestsTotal, httpRequestDurationSeconds, tokenRevokedMemoryCurrent, tokenRevokedRedisCardinality } from './metrics';
import { getRevocationMetrics } from '../auth/token-revocation.service';

const kStart = Symbol('startTime');

const _metricsCore: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Observe every request/response
  app.addHook('onRequest', async (req) => {
    // store hrtime start
    (req as any)[kStart] = process.hrtime.bigint();
  });

  app.addHook('onResponse', async (req, reply) => {
    try {
      const start: bigint | undefined = (req as any)[kStart];
      const route = String(((req as any).routeOptions?.url || req.url || 'unknown')).replace(/:/g, '_');
      const status = String(reply.statusCode);
      httpRequestsTotal.inc({ method: req.method, route, status });
      if (start) {
        const durNs = Number(process.hrtime.bigint() - start);
        const durSec = durNs / 1e9;
        httpRequestDurationSeconds.observe({ method: req.method, route, status }, durSec);
      }
    } catch (e) {
      app.log.debug({ err: e }, 'metrics onResponse failed');
    }
  });

  // Metrics endpoint
  app.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = process.env.METRICS_SECRET;
    if (secret) {
      const provided = request.headers['x-metrics-secret'];
      if (!provided || provided !== secret) {
        return reply.code(403).send('Forbidden');
      }
    }
    // Update dynamic gauges just-in-time
    try {
      const rev = await getRevocationMetrics();
      if (rev.backend === 'memory') {
        tokenRevokedMemoryCurrent.set(rev.entries);
        tokenRevokedRedisCardinality.set(0);
      } else {
        tokenRevokedRedisCardinality.set(rev.entries);
      }
    } catch {
      // ignore gauge update errors
    }
    reply.header('Content-Type', registry.contentType);
    return reply.send(await registry.metrics());
  });
};

export const metricsPlugin = fp(_metricsCore, { name: 'metrics-plugin' });
