"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const env_1 = __importDefault(require("../config/env"));
const BEARER = /^Bearer\s+(.+)$/i;
const authService = new auth_service_1.default();
function extractToken(req) {
    const h = req.header('authorization');
    if (h) {
        const m = h.match(BEARER);
        if (m)
            return m[1];
    }
    if (req.session?.bearer)
        return req.session.bearer;
    if (req.cookies?.auth_token)
        return req.cookies.auth_token;
    if (process.env.NODE_ENV !== 'production' && typeof req.query.token === 'string') {
        return req.query.token;
    }
    return undefined;
}
async function authMiddleware(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, Authentication needed to process' });
        }
        const key = process.env.JWS_KEY ?? env_1.default.jwtSecret ?? '';
        if (!key) {
            console.error('[authMiddleware] Missing JWS_KEY env');
            return res.status(503).json({ error: 'Server misconfiguration' });
        }
        const sid = await authService.get_SID(token, key);
        if (!sid) {
            return res.status(401).json({ error: 'Unauthorized, Authentication needed to process' });
        }
        req.auth = { sid, token };
        // Compatibility mapping for legacy validators expecting SessionID variants
        if (req.body && typeof req.body === 'object') {
            // Always enforce authoritative SID from JWT, ignoring any client supplied values.
            req.body.SessionID = sid;
            req.body._SessionID = sid;
            req.body.sessionId = sid;
            req.body._sessionId = sid;
            if (!req.body.BasSecurityContext) {
                req.body.BasSecurityContext = {};
            }
            req.body.BasSecurityContext._SessionId = sid;
        }
        next();
    }
    catch (err) {
        console.warn('[authMiddleware] token invalid', err instanceof Error ? err.message : String(err));
        return res.status(401).json({ error: 'Unauthorized, Authentication needed to process' });
    }
}
