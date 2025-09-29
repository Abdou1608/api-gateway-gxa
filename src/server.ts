// (Doit être importé avant express pour permettre le patching des auto-instrumentations)
import './observability/otel';
import express from 'express';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { registerRoutes } from './routes/fonctionnalite.routes';
import { applyGlobalMiddleware } from './middleware/Apply-Middlewares';
import config from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { metricsInstrumentation, metricsHandler } from './observability/metrics';
import { correlationId } from './middleware/correlation';

const app = express();

// Application des middlewares globaux + instrumentation métriques
applyGlobalMiddleware(app);
// Correlation id must be early
app.use(correlationId);
app.use(metricsInstrumentation);

// Documentation OpenAPI (lecture du YAML principal)
const openapiPathCandidates = [
  path.join(__dirname, 'middleware', 'openapi.yaml'),
  path.join(process.cwd(), 'src', 'middleware', 'openapi.yaml'),
];
let openapiDoc: any = undefined;
for (const p of openapiPathCandidates) {
  if (fs.existsSync(p)) {
    try { openapiDoc = YAML.load(p); } catch { /* noop */ }
    if (openapiDoc) break;
  }
}
if (openapiDoc) {
  app.get('/openapi.json', (_req, res) => res.json(openapiDoc));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
  console.log('✅ Documentation OpenAPI disponible sur /docs');
} else {
  console.warn('⚠️  Fichier OpenAPI non trouvé, /docs désactivé');
}

// Endpoint metrics (protégé via header si METRICS_SECRET configuré)
app.get('/metrics', metricsHandler);

// Enregistrement des routes applicatives
registerRoutes(app);

// 404 handler
app.use(notFoundHandler);
// Error handler global
app.use(errorHandler);

// Export app for testing; only start the server when executed directly
export default app;

if (require.main === module) {
  app.listen(config.port, config.host, () => {
    console.log(`🚀 Serveur SOAP REST Gateway démarré sur http://${config.host}:${config.port}`);
  });
}
