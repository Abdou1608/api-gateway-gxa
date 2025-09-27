"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const admin_guard_1 = require("../middleware/admin.guard");
const errors_1 = require("../common/errors");
const router = (0, express_1.Router)();
router.post('/revoke', admin_guard_1.adminGuard, async (req, res, next) => {
    const token = req.body?.token;
    if (!token || typeof token !== 'string')
        return next(new errors_1.ValidationError('token required', [{ path: 'token', message: 'required' }]));
    await (0, token_revocation_service_1.invalidateToken)(token);
    return res.status(204).send();
});
router.get('/revocation-metrics', admin_guard_1.adminGuard, async (_req, res, _next) => {
    const metrics = await (0, token_revocation_service_1.getRevocationMetrics)();
    res.json(metrics);
});
exports.default = router;
