export type ErrorType =
  | 'SOAP_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'TRANSFORM_ERROR'
  | 'UPSTREAM_TIMEOUT'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR';

export interface ErrorDetails {
  [key: string]: any;
}

export class BaseAppError<T extends ErrorDetails = ErrorDetails> extends Error {
  public readonly type: ErrorType;
  public readonly errorType: ErrorType;
  public readonly code: string;
  public readonly details?: T;
  public readonly cause?: unknown;
  public readonly statusCode: number;
  constructor(type: ErrorType, code: string, message: string, details?: T, cause?: unknown) {
    super(message);
    this.type = type;
    this.errorType = type;
    this.code = code;
    this.details = details;
    this.cause = cause;
    this.statusCode = errorHttpStatus(this);
  }
}

export interface SoapFaultDetails extends ErrorDetails {
  soapFault?: {
    faultcode?: string;
    faultstring?: string;
    detail?: any;
    state?: string;
  };
  source?: string;
  logEntries?: Array<{
    message: string;
    code?: string;
    severity?: string;
    path?: string;
    context?: Record<string, unknown>;
  }>;
  rawResponseSnippet?: string;
}

export class SoapServerError extends BaseAppError<SoapFaultDetails> {
  constructor(code: string, message: string, details: SoapFaultDetails, cause?: unknown) {
    super('SOAP_ERROR', code, message, details, cause);
  }
}

export class ValidationError extends BaseAppError<{ issues: Array<{ path: string; message: string }> }> {
  constructor(message = 'Invalid request', issues: Array<{ path: string; message: string }>) {
    super('VALIDATION_ERROR', 'VALIDATION.INVALID_BODY', message, { issues });
  }
}

export class AuthError extends BaseAppError<{ reason?: string }> {
  constructor(message = 'Unauthorized', details?: { reason?: string }) {
    super('AUTH_ERROR', 'AUTH.UNAUTHORIZED', message, details);
  }
}

export class TransformError extends BaseAppError<{ step?: string; inputSnippet?: unknown }> {
  constructor(message = 'Transform error', details?: { step?: string; inputSnippet?: unknown }, cause?: unknown) {
    super('TRANSFORM_ERROR', 'TRANSFORM.FAILED', message, details, cause);
  }
}

export class UpstreamTimeoutError extends BaseAppError {
  constructor(message = 'Upstream timeout', details?: ErrorDetails, cause?: unknown) {
    super('UPSTREAM_TIMEOUT', 'UPSTREAM.TIMEOUT', message, details, cause);
  }
}

export class NetworkError extends BaseAppError {
  constructor(message = 'Network error', details?: ErrorDetails, cause?: unknown) {
    super('NETWORK_ERROR', 'NETWORK.ERROR', message, details, cause);
  }
}

export class InternalError extends BaseAppError {
  constructor(message = 'Internal error', details?: ErrorDetails, cause?: unknown) {
    super('INTERNAL_ERROR', 'INTERNAL.ERROR', message, details, cause);
  }
}

export function errorHttpStatus(err: BaseAppError | Error): number {
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
