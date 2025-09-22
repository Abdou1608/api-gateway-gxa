"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRevokedRedisCardinality = exports.tokenRevokedMemoryCurrent = exports.tokenRevocationChecksTotal = exports.tokenRevocationsTotal = exports.httpRequestDurationSeconds = exports.httpRequestsTotal = exports.registry = void 0;
exports.metricsInstrumentation = metricsInstrumentation;
exports.metricsHandler = metricsHandler;
const prom_client_1 = require("prom-client");
const token_revocation_service_1 = require("../auth/token-revocation.service");
// Single registry
exports.registry = new prom_client_1.Registry();
(0, prom_client_1.collectDefaultMetrics)({ register: exports.registry });
exports.httpRequestsTotal = new prom_client_1.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [exports.registry]
});
exports.httpRequestDurationSeconds = new prom_client_1.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    registers: [exports.registry]
});
exports.tokenRevocationsTotal = new prom_client_1.Counter({
    name: 'token_revocations_total',
    help: 'Total token revocations',
    labelNames: ['backend', 'reason'],
    registers: [exports.registry]
});
exports.tokenRevocationChecksTotal = new prom_client_1.Counter({
    name: 'token_revocation_checks_total',
    help: 'Total token revocation checks',
    labelNames: ['backend', 'result'],
    registers: [exports.registry]
});
exports.tokenRevokedMemoryCurrent = new prom_client_1.Gauge({
    name: 'token_revoked_memory_current',
    help: 'Current number of revoked tokens kept in memory denylist',
    registers: [exports.registry]
});
exports.tokenRevokedRedisCardinality = new prom_client_1.Gauge({
    name: 'token_revoked_redis_cardinality',
    help: 'Approximate number of revoked tokens recorded via Redis HyperLogLog',
    registers: [exports.registry]
});
// Middleware instrumentation
function metricsInstrumentation(req, res, next) {
    const start = process.hrtime.bigint();
    const route = (req.route?.path || req.path || 'unknown').replace(/:/g, '_');
    res.on('finish', () => {
        const status = String(res.statusCode);
        exports.httpRequestsTotal.inc({ method: req.method, route, status });
        const durNs = Number(process.hrtime.bigint() - start);
        const durSec = durNs / 1e9;
        exports.httpRequestDurationSeconds.observe({ method: req.method, route, status }, durSec);
    });
    next();
}
// Metrics endpoint handler (protected by METRICS_SECRET if defined)
async function metricsHandler(req, res) {
    const secret = process.env.METRICS_SECRET;
    if (secret) {
        const provided = req.header('x-metrics-secret');
        if (!provided || provided !== secret) {
            return res.status(403).send('Forbidden');
        }
    }
    // Update dynamic gauges just-in-time
    try {
        const rev = await (0, token_revocation_service_1.getRevocationMetrics)();
        if (rev.backend === 'memory') {
            exports.tokenRevokedMemoryCurrent.set(rev.entries);
            exports.tokenRevokedRedisCardinality.set(0);
        }
        else {
            exports.tokenRevokedRedisCardinality.set(rev.entries);
        }
    }
    catch {
        // ignore gauge update errors
    }
    res.set('Content-Type', exports.registry.contentType);
    res.end(await exports.registry.metrics());
}
