// (Doit être importé avant express pour permettre le patching des auto-instrumentations)
// (Doit être importé avant l'instanciation du serveur pour permettre le patching des auto-instrumentations)
import './observability/otel';

// MIGRATION: Express -> Fastify
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import formbody from '@fastify/formbody';
// Note: load under-pressure dynamically to avoid build-time dependency when not installed
import swaggerUI from '@fastify/swagger-ui';
import path from 'path';
import fs from 'fs';
import YAML from 'yamljs';

import config from './config/env';
import { correlationPlugin } from './middleware/correlation';
import { applyGlobalMiddlewarePlugin } from './middleware/Apply-Middlewares.fastify';
import { buildErrorHandlers } from './middleware/error-handler.fastify';
import { metricsPlugin } from './observability/metrics.fastify';
import { registerRoutes } from './routes/fonctionnalite.routes.fastify';
import { authGlobalPreValidation } from './middleware/auth.fastify';

export const app = Fastify({
  logger: {
    level: 'info',
    // Enable pretty logs only when explicitly requested
    transport: process.env.ENABLE_PRETTY_LOG === '1'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

async function setupApp() {
  // --- Plugins globaux & observabilité ---
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute' });
  // Support application/x-www-form-urlencoded bodies (legacy clients)
  await app.register(formbody);
  try {
    const mod = await import('@fastify/under-pressure');
    await app.register(mod.default, {
      maxEventLoopDelay: 1000,
      healthCheck: async () => ({ status: 'ok' }),
      healthCheckInterval: 5000,
    });
  } catch {
    app.log.warn('under-pressure n est pas installé, backpressure/healthCheck natifs désactivés');
  }

  await app.register(applyGlobalMiddlewarePlugin); // MIGRATION: ex: compress/security
  await app.register(correlationPlugin);           // MIGRATION: X-Request-ID + logs
  await app.register(metricsPlugin);               // MIGRATION: /metrics + hooks

  // --- Auth hook (global) ---
  // Ensure BasSecurityContext is enforced from JWT before any route preValidation
  app.addHook('preValidation', authGlobalPreValidation);

  // --- OpenAPI / Swagger UI (lecture YAML existant) ---
  const openapiPathCandidates = [
    path.join(__dirname, 'middleware', 'openapi.yaml'),
    path.join(process.cwd(), 'src', 'middleware', 'openapi.yaml'),
  ];
  let openapiDoc: any;
  for (const p of openapiPathCandidates) {
    if (fs.existsSync(p)) {
      try { openapiDoc = YAML.load(p); } catch { /* noop */ }
      if (openapiDoc) break;
    }
  }
  if (openapiDoc) {
    app.get('/openapi.json', async (_req, reply) => reply.send(openapiDoc));
    if (process.env.ENABLE_SWAGGER_UI === '1') {
      try {
        // Register UI only when explicitly enabled to avoid test-time deps
        await app.register(swaggerUI, {
          routePrefix: '/docs',
          uiConfig: { docExpansion: 'list', deepLinking: true },
          staticCSP: true,
          transformSpecificationClone: false,
          transformSpecification: () => openapiDoc,
        });
        app.log.info('✅ Documentation OpenAPI disponible sur /docs');
      } catch (e) {
        app.log.warn({ err: e }, 'Swagger UI registration skipped');
      }
    }
  } else {
    app.log.warn('⚠️  Fichier OpenAPI non trouvé, /docs désactivé');
  }

  // --- Health ---
  app.get('/health', async () => ({ ok: true }));

  // --- Routes applicatives (converties) ---
  await app.register(registerRoutes, { prefix: '' });

  // --- 404 & erreurs globales ---
  const { setNotFound, setError } = buildErrorHandlers();
  app.setNotFoundHandler(setNotFound);
  app.setErrorHandler(setError);
}

// Exporte l'instance Fastify pour les tests et une promesse de ready
export const ready = (async () => {
  await setupApp();
  return app;
})();

export default app;

if (require.main === module) {
  ready.then(() =>
    app.listen({ port: config.port, host: config.host })
      .then(() => app.log.info(`🚀 Fastify SOAP REST Gateway sur http://${config.host}:${config.port}`))
  ).catch((e) => { app.log.error(e); process.exit(1); });
}
