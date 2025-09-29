"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const metrics_1 = require("./metrics");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const kStart = Symbol('startTime');
const _metricsCore = async (app) => {
    // Observe every request/response
    app.addHook('onRequest', async (req) => {
        // store hrtime start
        req[kStart] = process.hrtime.bigint();
    });
    app.addHook('onResponse', async (req, reply) => {
        try {
            const start = req[kStart];
            const route = String((req.routeOptions?.url || req.url || 'unknown')).replace(/:/g, '_');
            const status = String(reply.statusCode);
            metrics_1.httpRequestsTotal.inc({ method: req.method, route, status });
            if (start) {
                const durNs = Number(process.hrtime.bigint() - start);
                const durSec = durNs / 1e9;
                metrics_1.httpRequestDurationSeconds.observe({ method: req.method, route, status }, durSec);
            }
        }
        catch (e) {
            app.log.debug({ err: e }, 'metrics onResponse failed');
        }
    });
    // Metrics endpoint
    app.get('/metrics', async (request, reply) => {
        const secret = process.env.METRICS_SECRET;
        if (secret) {
            const provided = request.headers['x-metrics-secret'];
            if (!provided || provided !== secret) {
                return reply.code(403).send('Forbidden');
            }
        }
        // Update dynamic gauges just-in-time
        try {
            const rev = await (0, token_revocation_service_1.getRevocationMetrics)();
            if (rev.backend === 'memory') {
                metrics_1.tokenRevokedMemoryCurrent.set(rev.entries);
                metrics_1.tokenRevokedRedisCardinality.set(0);
            }
            else {
                metrics_1.tokenRevokedRedisCardinality.set(rev.entries);
            }
        }
        catch {
            // ignore gauge update errors
        }
        reply.header('Content-Type', metrics_1.registry.contentType);
        return reply.send(await metrics_1.registry.metrics());
    });
};
exports.metricsPlugin = (0, fastify_plugin_1.default)(_metricsCore, { name: 'metrics-plugin' });
