"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const errors_1 = require("../common/errors");
const problem_1 = require("../errors/problem");
function notFoundHandler(req, res, _next) {
    const requestId = res.locals.requestId || req.id || req.requestId;
    const pd = (0, problem_1.toProblem)(404, 'Not Found', `The requested resource ${req.originalUrl} was not found.`, { requestId });
    res.status(404).type('application/problem+json').json(pd);
}
function errorHandler(err, req, res, _next) {
    const requestId = res.locals.requestId || req.id || req.requestId;
    const appErr = err instanceof errors_1.BaseAppError
        ? err
        : new errors_1.InternalError(err?.message || 'Internal error');
    const status = (0, errors_1.errorHttpStatus)(appErr);
    const detail = appErr.message;
    const title = appErr.type.replace(/_/g, ' ');
    const typeUri = appErr.type === 'SOAP_ERROR'
        ? 'about:blank#SOAP_ERROR'
        : appErr.type === 'UPSTREAM_TIMEOUT'
            ? 'about:blank#UPSTREAM_TIMEOUT'
            : 'about:blank#INTERNAL_ERROR';
    const pd = (0, problem_1.toProblem)(status, title, detail, {
        requestId,
        code: appErr.code,
        errorType: appErr.type,
        details: appErr.details,
    });
    // Observability headers
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
    res.status(status).type('application/problem+json').json(pd);
}
