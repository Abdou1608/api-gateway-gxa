"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.NetworkError = exports.UpstreamTimeoutError = exports.TransformError = exports.AuthError = exports.ValidationError = exports.SoapServerError = exports.BaseAppError = void 0;
exports.errorHttpStatus = errorHttpStatus;
class BaseAppError extends Error {
    constructor(type, code, message, details, cause) {
        super(message);
        this.type = type;
        this.code = code;
        this.details = details;
        this.cause = cause;
    }
}
exports.BaseAppError = BaseAppError;
class SoapServerError extends BaseAppError {
    constructor(code, message, details, cause) {
        super('SOAP_ERROR', code, message, details, cause);
    }
}
exports.SoapServerError = SoapServerError;
class ValidationError extends BaseAppError {
    constructor(message = 'Invalid request', issues) {
        super('VALIDATION_ERROR', 'VALIDATION.INVALID_BODY', message, { issues });
    }
}
exports.ValidationError = ValidationError;
class AuthError extends BaseAppError {
    constructor(message = 'Unauthorized', details) {
        super('AUTH_ERROR', 'AUTH.UNAUTHORIZED', message, details);
    }
}
exports.AuthError = AuthError;
class TransformError extends BaseAppError {
    constructor(message = 'Transform error', details, cause) {
        super('TRANSFORM_ERROR', 'TRANSFORM.FAILED', message, details, cause);
    }
}
exports.TransformError = TransformError;
class UpstreamTimeoutError extends BaseAppError {
    constructor(message = 'Upstream timeout', details, cause) {
        super('UPSTREAM_TIMEOUT', 'UPSTREAM.TIMEOUT', message, details, cause);
    }
}
exports.UpstreamTimeoutError = UpstreamTimeoutError;
class NetworkError extends BaseAppError {
    constructor(message = 'Network error', details, cause) {
        super('NETWORK_ERROR', 'NETWORK.ERROR', message, details, cause);
    }
}
exports.NetworkError = NetworkError;
class InternalError extends BaseAppError {
    constructor(message = 'Internal error', details, cause) {
        super('INTERNAL_ERROR', 'INTERNAL.ERROR', message, details, cause);
    }
}
exports.InternalError = InternalError;
function errorHttpStatus(err) {
    if (err instanceof BaseAppError) {
        switch (err.type) {
            case 'AUTH_ERROR':
                return 401;
            case 'VALIDATION_ERROR':
                return 400;
            case 'TRANSFORM_ERROR':
                return 500;
            case 'UPSTREAM_TIMEOUT':
                return 504;
            case 'NETWORK_ERROR':
                return 502;
            case 'SOAP_ERROR':
                return 502;
            default:
                return 500;
        }
    }
    return 500;
}
