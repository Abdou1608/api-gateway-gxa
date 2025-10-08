"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.app = void 0;
// (Doit être importé avant express pour permettre le patching des auto-instrumentations)
// (Doit être importé avant l'instanciation du serveur pour permettre le patching des auto-instrumentations)
require("./observability/otel");
// MIGRATION: Express -> Fastify
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
// Note: load under-pressure dynamically to avoid build-time dependency when not installed
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const yamljs_1 = __importDefault(require("yamljs"));
const env_1 = __importDefault(require("./config/env"));
const correlation_1 = require("./middleware/correlation");
const Apply_Middlewares_fastify_1 = require("./middleware/Apply-Middlewares.fastify");
const error_handler_fastify_1 = require("./middleware/error-handler.fastify");
const metrics_fastify_1 = require("./observability/metrics.fastify");
const fonctionnalite_routes_fastify_1 = require("./routes/fonctionnalite.routes.fastify");
const auth_fastify_1 = require("./middleware/auth.fastify");
exports.app = (0, fastify_1.default)({
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
    await exports.app.register(cors_1.default, { origin: true, credentials: true });
    await exports.app.register(rate_limit_1.default, { max: 200, timeWindow: '1 minute' });
    // Support application/x-www-form-urlencoded bodies (legacy clients)
    await exports.app.register(formbody_1.default);
    await exports.app.register(multipart_1.default);
    try {
        const mod = await Promise.resolve().then(() => __importStar(require('@fastify/under-pressure')));
        await exports.app.register(mod.default, {
            maxEventLoopDelay: 1000,
            healthCheck: async () => ({ status: 'ok' }),
            healthCheckInterval: 5000,
        });
    }
    catch {
        exports.app.log.warn('under-pressure n est pas installé, backpressure/healthCheck natifs désactivés');
    }
    await exports.app.register(Apply_Middlewares_fastify_1.applyGlobalMiddlewarePlugin); // MIGRATION: ex: compress/security
    await exports.app.register(correlation_1.correlationPlugin); // MIGRATION: X-Request-ID + logs
    await exports.app.register(metrics_fastify_1.metricsPlugin); // MIGRATION: /metrics + hooks
    // --- Auth hook (global) ---
    // Ensure BasSecurityContext is enforced from JWT before any route preValidation
    exports.app.addHook('preValidation', auth_fastify_1.authGlobalPreValidation);
    // --- OpenAPI / Swagger UI (lecture YAML existant) ---
    const openapiPathCandidates = [
        path_1.default.join(__dirname, 'middleware', 'openapi.yaml'),
        path_1.default.join(process.cwd(), 'src', 'middleware', 'openapi.yaml'),
    ];
    let openapiDoc;
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
        exports.app.get('/openapi.json', async (_req, reply) => reply.send(openapiDoc));
        if (process.env.ENABLE_SWAGGER_UI === '1') {
            try {
                // Register UI only when explicitly enabled to avoid test-time deps
                await exports.app.register(swagger_ui_1.default, {
                    routePrefix: '/docs',
                    uiConfig: { docExpansion: 'list', deepLinking: true },
                    staticCSP: true,
                    transformSpecificationClone: false,
                    transformSpecification: () => openapiDoc,
                });
                exports.app.log.info('✅ Documentation OpenAPI disponible sur /docs');
            }
            catch (e) {
                exports.app.log.warn({ err: e }, 'Swagger UI registration skipped');
            }
        }
    }
    else {
        exports.app.log.warn('⚠️  Fichier OpenAPI non trouvé, /docs désactivé');
    }
    // --- Health ---
    exports.app.get('/health', async () => ({ ok: true }));
    // --- Routes applicatives (converties) ---
    await exports.app.register(fonctionnalite_routes_fastify_1.registerRoutes, { prefix: '' });
    // --- 404 & erreurs globales ---
    const { setNotFound, setError } = (0, error_handler_fastify_1.buildErrorHandlers)();
    exports.app.setNotFoundHandler(setNotFound);
    exports.app.setErrorHandler(setError);
}
// Exporte l'instance Fastify pour les tests et une promesse de ready
exports.ready = (async () => {
    await setupApp();
    return exports.app;
})();
exports.default = exports.app;
if (require.main === module) {
    exports.ready.then(() => exports.app.listen({ port: env_1.default.port, host: env_1.default.host })
        .then(() => exports.app.log.info(`🚀 Fastify SOAP REST Gateway sur http://${env_1.default.host}:${env_1.default.port}`))).catch((e) => { exports.app.log.error(e); process.exit(1); });
}
