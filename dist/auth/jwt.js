"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = verifyJwt;
const crypto_1 = require("crypto");
function verifyJwt(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return null;
    const token = auth.slice(7);
    const secret = req.server.config?.JWT_SECRET || '';
    const fake = (0, crypto_1.createHmac)('sha256', secret).update('payload').digest('hex');
    return token === fake ? { sub: 'demo' } : null;
}
