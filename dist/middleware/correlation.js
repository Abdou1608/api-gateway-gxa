"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationId = correlationId;
const crypto_1 = require("crypto");
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
