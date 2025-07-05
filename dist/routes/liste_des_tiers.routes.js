"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_search_service_1 = require("../services/liste_des_tiers/tiers_search.service");
const router = (0, express_1.Router)();
router.post('/tiers-search', async (req, res) => {
    try {
        const result = await (0, tiers_search_service_1.tiers_search)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
