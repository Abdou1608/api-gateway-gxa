"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = jwtAuth;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = __importDefault(require("../config/env"));
// Very simple HMAC based token check (placeholder). Expect token == HMAC(secret, 'payload').
function verifyToken(token) {
    const expected = crypto_1.default.createHmac('sha256', env_1.default.jwtSecret).update('payload').digest('hex');
    if (token === expected)
        return { sub: 'demo' };
    return null;
}
function jwtAuth(optional = false) {
    return (req, res, next) => {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            if (optional)
                return next();
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }
        const token = auth.slice(7);
        const payload = verifyToken(token);
        if (!payload) {
            if (optional)
                return next();
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = payload;
        next();
    };
}
