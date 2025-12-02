"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPreHandler = authPreHandler;
exports.authGlobalPreValidation = authGlobalPreValidation;
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const env_1 = __importDefault(require("../config/env"));
const BEARER = /^Bearer\s+(.+)$/i;
const authService = new auth_service_1.default();
function extractToken(headers, query) {
    const h = headers['authorization'] || headers['Authorization'];
    if (typeof h === 'string') {
        const m = h.match(BEARER);
        if (m)
            return m[1];
    }
    if (process.env.NODE_ENV !== 'production' && typeof query?.token === 'string') {
        return query.token;
    }
    return undefined;
}
async function authPreHandler(request, reply) {
    try {
        const token = extractToken(request.headers, request.query);
        if (!token) {
            return reply.code(401).send({ error: 'Unauthorized, Authentication needed to process' });
        }
        const key = process.env.JWS_KEY ?? env_1.default.jwtSecret ?? '';
        if (!key) {
            request.log.error('[authPreHandler] Missing JWS_KEY env');
            return reply.code(503).send({ error: 'Server misconfiguration' });
        }
        const sid = await authService.get_SID(token, key);
        console.warn('=====--------Voici le SID du Auth.fastify:', sid);
        if (!sid) {
            return reply.code(401).send({ error: 'Unauthorized, Authentication needed to process' });
        }
        request.auth = { sid, token };
        // Map into body for legacy validators: enforce authoritative SID
        const body = request.body;
        if (body && typeof body === 'object') {
            body.SessionID = sid;
            body._SessionID = sid;
            body.sessionId = sid;
            body._sessionId = sid;
            if (!body.BasSecurityContext)
                body.BasSecurityContext = {};
            body.BasSecurityContext._SessionId = sid;
            body.BasSecurityContext.SessionId = sid;
            console.warn('=====--------Voici le Body de la requete de Auth.fastify:', body);
            request.body = body;
        }
    }
    catch (err) {
        request.log.warn({ err }, '[authPreHandler] token invalid');
        return reply.code(401).send({ error: { detail: 'Unauthorized, Authentication needed to process', message: err instanceof Error ? err.message : String(err) } });
    }
}
/**
 * Global preValidation hook: applies authPreHandler for protected routes so validators
 * can see the enforced BasSecurityContext before schema validation.
 * Skips public and separately-guarded routes.
 */
async function authGlobalPreValidation(request, reply) {
    const url = request.url || '';
    // Public endpoints or separately-guarded ones
    if (url === '/ping' ||
        url.startsWith('/health') ||
        url.startsWith('/openapi') ||
        url.startsWith('/docs') ||
        url.startsWith('/debug') ||
        url === '/api/login' ||
        url.startsWith('/api/admin') ||
        (process.env.BYPASS_EXPORT_CONVERT_AUTH === '1' && url.startsWith('/api/tools/convert/'))) {
        return; // skip auth
    }
    return authPreHandler(request, reply);
}
