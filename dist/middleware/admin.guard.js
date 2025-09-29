"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = adminGuard;
const crypto_1 = require("crypto");
function safeCompare(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(aBuf, bBuf);
}
function adminGuard(req, res, next) {
    const configured = process.env.ADMIN_SECRET;
    if (!configured)
        return res.status(503).json({ error: 'Admin secret not configured' });
    const provided = req.header('x-admin-secret') || '';
    // Dev-only bypass: allow query param `admin_secret` when not in production
    const devBypass = process.env.NODE_ENV !== 'production';
    const providedQuery = req.query?.admin_secret || '';
    const okHeader = provided && safeCompare(provided, configured);
    const okQuery = devBypass && providedQuery && safeCompare(providedQuery, configured);
    if (!okHeader && !okQuery)
        return res.status(401).json({ error: 'Unauthorized' });
    return next();
}
exports.default = adminGuard;
