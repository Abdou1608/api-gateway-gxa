"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErrorHandlers = buildErrorHandlers;
function buildErrorHandlers() {
    const setNotFound = (request, reply) => {
        reply.code(404).send({
            error: 'Not Found',
            message: `Route ${request.method} ${request.url} not found`,
            requestId: request.reqId,
        });
    };
    const setError = (error, request, reply) => {
        const status = error.statusCode ?? 500;
        request.log.error({ err: error }, 'Unhandled error');
        reply.code(status).send({
            error: error.name || 'Error',
            message: error.message,
            requestId: request.reqId,
        });
    };
    return { setNotFound, setError };
}
