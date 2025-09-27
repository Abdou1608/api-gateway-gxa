"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// (Doit être importé avant express pour permettre le patching des auto-instrumentations)
require("./observability/otel");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const fonctionnalite_routes_1 = require("./routes/fonctionnalite.routes");
const Apply_Middlewares_1 = require("./middleware/Apply-Middlewares");
const env_1 = __importDefault(require("./config/env"));
const error_handler_1 = require("./middleware/error-handler");
const metrics_1 = require("./observability/metrics");
const request_id_1 = require("./common/middleware/request-id");
const app = (0, express_1.default)();
// Application des middlewares globaux + instrumentation métriques
(0, Apply_Middlewares_1.applyGlobalMiddleware)(app);
app.use(request_id_1.requestIdMiddleware);
app.use(metrics_1.metricsInstrumentation);
// Documentation OpenAPI (lecture du YAML principal)
const openapiPathCandidates = [
    path_1.default.join(__dirname, 'middleware', 'openapi.yaml'),
    path_1.default.join(process.cwd(), 'src', 'middleware', 'openapi.yaml'),
];
let openapiDoc = undefined;
for (const p of openapiPathCandidates) {
    if (fs_1.default.existsSync(p)) {
        try {
            openapiDoc = yamljs_1.default.load(p);
        }
        catch { /* noop */ }
        if (openapiDoc)
            break;
    }
}
if (openapiDoc) {
    app.get('/openapi.json', (_req, res) => res.json(openapiDoc));
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDoc));
    console.log('✅ Documentation OpenAPI disponible sur /docs');
}
else {
    console.warn('⚠️  Fichier OpenAPI non trouvé, /docs désactivé');
}
// Endpoint metrics (protégé via header si METRICS_SECRET configuré)
app.get('/metrics', metrics_1.metricsHandler);
// Enregistrement des routes applicatives
(0, fonctionnalite_routes_1.registerRoutes)(app);
// 404 handler
app.use(error_handler_1.notFoundHandler);
// Error handler global
app.use(error_handler_1.errorHandler);
// Export app for testing; only start the server when executed directly
exports.default = app;
if (require.main === module) {
    app.listen(env_1.default.port, env_1.default.host, () => {
        console.log(`🚀 Serveur SOAP REST Gateway démarré sur http://${env_1.default.host}:${env_1.default.port}`);
    });
}
