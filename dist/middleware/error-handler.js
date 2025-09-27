"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const errors_1 = require("../common/errors");
function notFoundHandler(req, res, _next) {
    const now = new Date().toISOString();
    const requestId = res.locals.requestId || req.requestId;
    res.status(404).json({
        error: {
            type: 'INTERNAL_ERROR',
            code: 'HTTP.NOT_FOUND',
            message: 'Not Found',
            details: { path: req.originalUrl },
            requestId,
            timestamp: now,
        }
    });
}
function errorHandler(err, req, res, _next) {
    const now = new Date().toISOString();
    const requestId = res.locals.requestId || req.requestId;
    const appErr = err instanceof errors_1.BaseAppError
        ? err
        : new errors_1.InternalError(err?.message || 'Internal error');
    const status = (0, errors_1.errorHttpStatus)(appErr);
    const body = {
        error: {
            type: appErr.type,
            code: appErr.code,
            message: appErr.message,
            details: appErr.details,
            requestId,
            timestamp: now,
        }
    };
    // Observability headers (avoid leaking details)
    try {
        res.setHeader('X-Error-Type', appErr.type);
    }
    catch { }
    try {
        res.setHeader('X-Error-Code', appErr.code);
    }
    catch { }
    if (appErr.type === 'SOAP_ERROR') {
        try {
            res.setHeader('X-SOAP-FAULT', '1');
        }
        catch { }
    }
    // Include stack in non-production to help debugging
    if (process.env.NODE_ENV !== 'production' && err?.stack) {
        body.error.stack = err.stack;
    }
    res.status(status).json(body);
}
