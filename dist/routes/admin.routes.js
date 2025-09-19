"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const admin_guard_1 = require("../middleware/admin.guard");
const router = (0, express_1.Router)();
router.post('/revoke', admin_guard_1.adminGuard, async (req, res) => {
    const token = req.body?.token;
    if (!token || typeof token !== 'string')
        return res.status(400).json({ error: 'token required' });
    await (0, token_revocation_service_1.invalidateToken)(token);
    return res.status(204).send();
});
router.get('/revocation-metrics', admin_guard_1.adminGuard, async (_req, res) => {
    const metrics = await (0, token_revocation_service_1.getRevocationMetrics)();
    res.json(metrics);
});
exports.default = router;
