"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
// Central application error representation
class AppError extends Error {
    constructor(message, status = 500, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.AppError = AppError;
function notFoundHandler(req, res, _next) {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}
function errorHandler(err, _req, res, _next) {
    const status = err instanceof AppError ? err.status : 500;
    const payload = {
        error: err.message || 'Internal Server Error',
    };
    if (err.details)
        payload.details = err.details;
    // Ajout d'un header d'observabilité si c'est une fault SOAP normalisée
    if (err.details && (err.details.faultcode || err.details.errorCode)) {
        try {
            res.setHeader('X-SOAP-FAULT', '1');
        }
        catch { /* ignore */ }
        if (err.details.errorCode) {
            try {
                res.setHeader('X-ERROR-CODE', String(err.details.errorCode));
            }
            catch { /* ignore */ }
        }
    }
    if (process.env.NODE_ENV !== 'production') {
        payload.stack = err.stack;
    }
    res.status(status).json(payload);
}
