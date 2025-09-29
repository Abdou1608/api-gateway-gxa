"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soapSessionReopenFailuresTotal = exports.soapSessionReopenSuccessTotal = exports.soapSessionReopenAttemptsTotal = exports.soapRequestDurationByOwnerSeconds = exports.soapRequestDurationSeconds = exports.queueSizeGauge = exports.tokenRevokedRedisCardinality = exports.tokenRevokedMemoryCurrent = exports.tokenRevocationChecksTotal = exports.tokenRevocationsTotal = exports.httpRequestDurationSeconds = exports.httpRequestsTotal = exports.registry = void 0;
exports.recordQueueSize = recordQueueSize;
exports.observeSoapDuration = observeSoapDuration;
exports.observeSoapDurationLabeled = observeSoapDurationLabeled;
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
// Pending SOAP queue metrics
exports.queueSizeGauge = new prom_client_1.Gauge({
    name: 'soap_pending_queue_size',
    help: 'Current number of in-flight SOAP requests',
    registers: [exports.registry]
});
exports.soapRequestDurationSeconds = new prom_client_1.Histogram({
    name: 'soap_request_duration_seconds',
    help: 'Duration of SOAP requests (RunAction end-to-end)',
    labelNames: ['action'],
    buckets: [0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    registers: [exports.registry]
});
// Optional high-cardinality metrics (enable via SOAP_METRICS_LABELS=1)
exports.soapRequestDurationByOwnerSeconds = new prom_client_1.Histogram({
    name: 'soap_request_duration_by_owner_seconds',
    help: 'Duration of SOAP requests partitioned by owner/domain (enable with SOAP_METRICS_LABELS=1)',
    labelNames: ['owner', 'domain'],
    buckets: [0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    registers: [exports.registry]
});
// Session reopen metrics
exports.soapSessionReopenAttemptsTotal = new prom_client_1.Counter({
    name: 'soap_session_reopen_attempts_total',
    help: 'Number of attempts to reopen SOAP session after faults',
    labelNames: ['owner', 'domain'],
    registers: [exports.registry]
});
exports.soapSessionReopenSuccessTotal = new prom_client_1.Counter({
    name: 'soap_session_reopen_success_total',
    help: 'Number of successful SOAP session reopen events',
    labelNames: ['owner', 'domain'],
    registers: [exports.registry]
});
exports.soapSessionReopenFailuresTotal = new prom_client_1.Counter({
    name: 'soap_session_reopen_failures_total',
    help: 'Number of failed SOAP session reopen events',
    labelNames: ['owner', 'domain'],
    registers: [exports.registry]
});
function recordQueueSize(size) {
    exports.queueSizeGauge.set(size);
}
function observeSoapDuration(action, seconds) {
    exports.soapRequestDurationSeconds.observe({ action }, seconds);
}
function observeSoapDurationLabeled(owner, domain, seconds) {
    if (process.env.SOAP_METRICS_LABELS === '1') {
        const o = (owner && owner.length <= 64) ? owner : (owner ? 'redacted' : 'unknown');
        const d = (domain && domain.length <= 64) ? domain : (domain ? 'redacted' : 'unknown');
        exports.soapRequestDurationByOwnerSeconds.observe({ owner: o, domain: d }, seconds);
    }
}
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
