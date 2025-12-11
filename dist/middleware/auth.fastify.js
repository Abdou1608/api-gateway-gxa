"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__setCheckSessionInvoker = __setCheckSessionInvoker;
exports.authPreHandler = authPreHandler;
exports.authGlobalPreValidation = authGlobalPreValidation;
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const env_1 = __importDefault(require("../config/env"));
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BEARER = /^Bearer\s+(.+)$/i;
const authService = new auth_service_1.default();
let checkSessionInvoker = null;
function __setCheckSessionInvoker(fn) {
    checkSessionInvoker = fn ?? null;
}
async function getCheckSessionInvoker() {
    if (checkSessionInvoker) {
        return checkSessionInvoker;
    }
    const mod = await Promise.resolve().then(() => __importStar(require('../services/check_session/checksession_.service')));
    if (typeof mod.checksession_ !== 'function') {
        throw new Error('checksession_ service must export a function');
    }
    checkSessionInvoker = mod.checksession_;
    return checkSessionInvoker;
}
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
            return reply.code(401).send({ error: 'Non autorisé, authentification requise pour traiter' });
        }
        const key = process.env.JWS_KEY ?? env_1.default.jwtSecret ?? '';
        if (!key) {
            request.log.error('[authPreHandler] Missing JWS_KEY env');
            return reply.code(503).send({ error: 'Server misconfiguration' });
        }
        const sid = await authService.get_SID(token, key);
        console.warn('=====--------Voici le SID du Auth.fastify:', sid);
        if (!sid) {
            return reply.code(401).send({ error: 'Non autorisé, authentification requise pour traiter' });
        }
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = sid;
        const runCheckSession = await getCheckSessionInvoker();
        const result = await runCheckSession(ctx);
        if (!result) {
            return reply.code(402).send({ error: 'Non autorisé, Session invalide ou expirée' });
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
        request.log.warn({ err }, '[authPreHandler] Erreur lors de la validation du jeton');
        return reply.code(401).send({ error: { detail: 'Non autorisé, Erreur lors de la validation de votre session', message: err instanceof Error ? err.message : String(err) } });
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
