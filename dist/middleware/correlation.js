"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationPlugin = void 0;
exports.correlationId = correlationId;
const crypto_1 = require("crypto");
const correlationPlugin = async (app) => {
    app.addHook('onRequest', async (request, reply) => {
        const hdr = request.headers['x-request-id'];
        const id = (Array.isArray(hdr) ? hdr[0] : hdr) || (0, crypto_1.randomUUID)();
        // Binder l’id sur le logger
        request.log = request.log.child({ reqId: id });
        request.reqId = id;
        reply.header('X-Request-ID', id);
    });
};
exports.correlationPlugin = correlationPlugin;
/**
 * correlationId middleware
 * - Ensures every request has a stable req.id and x-request-id header
 * - Mirrors the value into res.locals.requestId and the response header
 */
function correlationId(req, res, next) {
    const header = req.header('x-request-id') || req.header('X-Request-Id');
    const id = header && header.trim() !== '' ? header : (0, crypto_1.randomUUID)();
    req.id = id;
    req.requestId = id; // keep backward-compat with existing code
    res.locals.requestId = id;
    res.setHeader('x-request-id', id);
    next();
}
