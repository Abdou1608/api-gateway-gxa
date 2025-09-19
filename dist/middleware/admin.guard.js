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
    if (!safeCompare(provided, configured))
        return res.status(401).json({ error: 'Unauthorized' });
    return next();
}
exports.default = adminGuard;
