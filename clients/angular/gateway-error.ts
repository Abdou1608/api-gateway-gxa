/**
 * API Gateway – Client error definitions and helpers (Angular-friendly)
 *
 * Copy this file into your Angular project (e.g., src/app/shared/errors/)
 * and use normalizeAngularHttpError in your global HttpInterceptor.
 */

// 1) Canonical error types (must match backend)
export type GatewayErrorType =
  | 'SOAP_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'TRANSFORM_ERROR'
  | 'UPSTREAM_TIMEOUT'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR';

// 2) Common functional codes (non-exhaustive; backend may return others)
export type GatewayErrorCode =
  | 'AUTH.UNAUTHORIZED'
  | 'VALIDATION.INVALID_BODY'
  | 'TRANSFORM.FAILED'
  | 'UPSTREAM.TIMEOUT'
  | 'NETWORK.ERROR'
  | 'INTERNAL.ERROR'
  | 'SOAP.FAULT'
  | (string & {}); // allow any other code

// 3) SOAP fault details (only for SOAP_ERROR)
export interface SoapFaultDetails {
  faultcode?: string;
  faultstring?: string;
  detail?: unknown;
  state?: string;
}

// 4) Canonical error body as returned by the gateway
export interface GatewayErrorBody {
  error: {
    type: GatewayErrorType;
    code: GatewayErrorCode;
    message: string;
    details?: Record<string, unknown> & { soapFault?: SoapFaultDetails };
    requestId?: string;
    timestamp?: string; // ISO-8601
    // In non-production backend, stack may be included for debugging
    stack?: string;
  };
}

// 5) Error-related headers added by the gateway
export const ERROR_HEADER_TYPE = 'X-Error-Type';
export const ERROR_HEADER_CODE = 'X-Error-Code';
export const ERROR_HEADER_SOAP = 'X-SOAP-FAULT';
export const REQUEST_ID_HEADER = 'X-Request-Id';

export interface GatewayErrorHeaders {
  [ERROR_HEADER_TYPE]?: string | null;
  [ERROR_HEADER_CODE]?: string | null;
  [ERROR_HEADER_SOAP]?: string | null; // '1' if SOAP fault
  [REQUEST_ID_HEADER]?: string | null;
}

// 6) Normalized shape the frontend can rely on everywhere
export interface NormalizedGatewayError {
  type: GatewayErrorType;
  code: GatewayErrorCode;
  message: string;
  details?: Record<string, unknown> & { soapFault?: SoapFaultDetails };
  requestId?: string;
  timestamp?: string;
  httpStatus?: number;
  headers?: GatewayErrorHeaders;
  isSoapFault?: boolean;
}

// 7) Type guard – check if an arbitrary body looks like a Gateway error
export function isGatewayErrorBody(input: unknown): input is GatewayErrorBody {
  if (!input || typeof input !== 'object') return false;
  const maybe = input as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    maybe.error &&
    typeof maybe.error === 'object' &&
    typeof maybe.error.type === 'string' &&
    typeof maybe.error.code === 'string' &&
    typeof maybe.error.message === 'string'
  );
}

// 8) Header helpers – case-insensitive access
function getHeaderCaseInsensitive(
  getter: ((name: string) => string | null | undefined) | undefined,
  headersObj: Record<string, string | null | undefined> | undefined,
  name: string
): string | null | undefined {
  if (getter) return getter(name);
  if (!headersObj) return undefined;
  const key = Object.keys(headersObj).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? headersObj[key] ?? null : undefined;
}

// 9) Main normalizer – works with Angular HttpErrorResponse or generic shapes
export interface NormalizeInput {
  status?: number;
  body?: unknown; // Angular: err.error
  // One of the two below:
  getHeader?: (name: string) => string | null | undefined; // Angular: err.headers.get.bind(err.headers)
  headersObj?: Record<string, string | null | undefined>; // Fetch/axios-like headers map
}

export function normalizeGatewayError(input: NormalizeInput): NormalizedGatewayError {
  const httpStatus = input.status;
  const rawBody = input.body;

  // Try to coerce string bodies to JSON
  let body: unknown = rawBody;
  if (typeof rawBody === 'string') {
    try { body = JSON.parse(rawBody); } catch { /* leave as string */ }
  }

  // Extract headers
  const hType = getHeaderCaseInsensitive(input.getHeader, input.headersObj, ERROR_HEADER_TYPE) || undefined;
  const hCode = getHeaderCaseInsensitive(input.getHeader, input.headersObj, ERROR_HEADER_CODE) || undefined;
  const hSoap = getHeaderCaseInsensitive(input.getHeader, input.headersObj, ERROR_HEADER_SOAP) || undefined;
  const hReqId = getHeaderCaseInsensitive(input.getHeader, input.headersObj, REQUEST_ID_HEADER) || undefined;

  const headers: GatewayErrorHeaders | undefined =
    hType || hCode || hSoap || hReqId
      ? { [ERROR_HEADER_TYPE]: hType ?? null, [ERROR_HEADER_CODE]: hCode ?? null, [ERROR_HEADER_SOAP]: hSoap ?? null, [REQUEST_ID_HEADER]: hReqId ?? null }
      : undefined;

  // Known gateway error body
  if (isGatewayErrorBody(body)) {
    const { error } = body;
    return {
      type: error.type,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: error.requestId || (hReqId ?? undefined) || undefined,
      timestamp: error.timestamp,
      httpStatus,
      headers,
      isSoapFault: (error.type === 'SOAP_ERROR') || hSoap === '1',
    };
  }

  // Fallback: build a generic INTERNAL_ERROR-like shape
  return {
    type: (hType as GatewayErrorType) || 'INTERNAL_ERROR',
    code: (hCode as GatewayErrorCode) || 'INTERNAL.ERROR',
    message: typeof rawBody === 'string' ? rawBody : 'An unexpected error occurred',
    details: (typeof body === 'object' ? (body as Record<string, unknown>) : undefined),
    requestId: hReqId || undefined,
    httpStatus,
    headers,
    isSoapFault: hSoap === '1',
  };
}

// 10) Angular convenience wrapper – no hard dependency on Angular types.
// Usage in Angular interceptor:
// const normalized = normalizeAngularHttpError(err);
export function normalizeAngularHttpError(err: {
  status: number;
  error?: unknown;
  headers?: { get(name: string): string | null } | null;
}): NormalizedGatewayError {
  return normalizeGatewayError({
    status: err.status,
    body: err.error,
    getHeader: err.headers ? err.headers.get.bind(err.headers) : undefined,
  });
}

// 11) Optional: Default client-side mapping to i18n keys (adjust as needed)
export const DEFAULT_ERROR_I18N_KEYS: Record<GatewayErrorCode, string> = {
  'AUTH.UNAUTHORIZED': 'errors.auth.unauthorized',
  'VALIDATION.INVALID_BODY': 'errors.validation.invalidBody',
  'TRANSFORM.FAILED': 'errors.transform.failed',
  'UPSTREAM.TIMEOUT': 'errors.upstream.timeout',
  'NETWORK.ERROR': 'errors.network.generic',
  'INTERNAL.ERROR': 'errors.internal.generic',
  'SOAP.FAULT': 'errors.soap.fault',
};

export function resolveI18nKeyFromError(err: NormalizedGatewayError): string {
  return DEFAULT_ERROR_I18N_KEYS[err.code] || `errors.${err.type.toLowerCase()}.generic`;
}

// 12) Optional: severity suggestion
export function inferSeverity(err: NormalizedGatewayError): 'info' | 'warning' | 'error' {
  switch (err.type) {
    case 'VALIDATION_ERROR':
      return 'warning';
    case 'AUTH_ERROR':
      return 'warning';
    default:
      return 'error';
  }
}
