"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_update_service_1 = require("../services/update_tier/tiers_update.service");
const router = (0, express_1.Router)();
router.post('/tiers-update', async (req, res) => {
    const dossier = JSON.parse(req.body.dossier);
    try {
        const result = await (0, tiers_update_service_1.tiers_update)(dossier, req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
