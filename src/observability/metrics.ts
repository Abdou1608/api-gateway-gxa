import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client';
import type { Request, Response, NextFunction } from 'express';
import { getRevocationMetrics } from '../auth/token-revocation.service';

// Single registry
export const registry = new Registry();
collectDefaultMetrics({ register: registry });

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [registry]
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration seconds',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.01,0.025,0.05,0.1,0.25,0.5,1,2,5,10],
  registers: [registry]
});

export const tokenRevocationsTotal = new Counter({
  name: 'token_revocations_total',
  help: 'Total token revocations',
  labelNames: ['backend','reason'] as const,
  registers: [registry]
});

export const tokenRevocationChecksTotal = new Counter({
  name: 'token_revocation_checks_total',
  help: 'Total token revocation checks',
  labelNames: ['backend','result'] as const,
  registers: [registry]
});

export const tokenRevokedMemoryCurrent = new Gauge({
  name: 'token_revoked_memory_current',
  help: 'Current number of revoked tokens kept in memory denylist',
  registers: [registry]
});

export const tokenRevokedRedisCardinality = new Gauge({
  name: 'token_revoked_redis_cardinality',
  help: 'Approximate number of revoked tokens recorded via Redis HyperLogLog',
  registers: [registry]
});

// Middleware instrumentation
export function metricsInstrumentation(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const route = (req.route?.path || req.path || 'unknown').replace(/:/g,'_');
  res.on('finish', () => {
    const status = String(res.statusCode);
    httpRequestsTotal.inc({ method: req.method, route, status });
    const durNs = Number(process.hrtime.bigint() - start);
    const durSec = durNs / 1e9;
    httpRequestDurationSeconds.observe({ method: req.method, route, status }, durSec);
  });
  next();
}

// Metrics endpoint handler (protected by METRICS_SECRET if defined)
export async function metricsHandler(req: Request, res: Response) {
  const secret = process.env.METRICS_SECRET;
  if (secret) {
    const provided = req.header('x-metrics-secret');
    if (!provided || provided !== secret) {
      return res.status(403).send('Forbidden');
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
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
}
