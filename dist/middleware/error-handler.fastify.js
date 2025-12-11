"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErrorHandlers = buildErrorHandlers;
const crypto_1 = require("crypto");
const errors_1 = require("../common/errors");
function resolveRequestId(request, reply) {
    return (request.reqId ||
        request.id ||
        reply.getHeader('X-Request-ID') ||
        request.headers['x-request-id'] ||
        (0, crypto_1.randomUUID)());
}
function buildErrorHandlers() {
    const setNotFound = (request, reply) => {
        reply.code(404).send({
            error: 'Not Found',
            message: `Route ${request.method} ${request.url} not found`,
            requestId: request.reqId,
        });
    };
    const setError = (error, request, reply) => {
        const reqId = resolveRequestId(request, reply);
        const maybeAppError = (error instanceof errors_1.BaseAppError) || (typeof error?.type === 'string' && typeof error?.code === 'string');
        if (maybeAppError) {
            const typedError = error;
            const domainType = typedError.errorType ?? typedError.type;
            const status = typedError.statusCode ?? (0, errors_1.errorHttpStatus)(typedError);
            request.log.warn({ err: error, reqId }, 'Handled application error');
            reply
                .header('X-Request-ID', reqId)
                .header('Content-Type', 'application/problem+json')
                .header('X-Error-Type', domainType)
                .header('X-Error-Code', typedError.code)
                .code(status)
                .send({
                status,
                errorType: domainType,
                code: typedError.code,
                detail: typedError.message,
                requestId: reqId,
                ...(typedError.details ? { details: typedError.details } : {}),
            });
            return;
        }
        const status = error.statusCode ?? 500;
        request.log.error({ err: error }, 'Unhandled error');
        reply
            .header('X-Request-ID', reqId)
            .code(status).send({
            error: error.name || 'Error',
            message: error.message,
            requestId: reqId,
        });
    };
    return { setNotFound, setError };
}
