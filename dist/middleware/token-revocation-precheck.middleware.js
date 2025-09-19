"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRevocationPrecheck = tokenRevocationPrecheck;
const token_revocation_service_1 = require("../auth/token-revocation.service");
const BEARER = /^Bearer\s+(.+)$/i;
async function tokenRevocationPrecheck(req, res, next) {
    try {
        const authHeader = req.header('authorization');
        const token = authHeader?.match(BEARER)?.[1];
        if (!token)
            return res.status(401).json({ error: 'Unauthorized' });
        if (await (0, token_revocation_service_1.isTokenRevoked)(token))
            return res.status(401).json({ error: 'Unauthorized' });
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
exports.default = tokenRevocationPrecheck;
