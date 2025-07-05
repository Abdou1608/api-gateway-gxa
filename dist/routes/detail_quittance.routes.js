"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_details_service_1 = require("../services/detail_quittance/quittance_details.service");
const router = (0, express_1.Router)();
router.post('/quittance-details', async (req, res) => {
    try {
        const result = await (0, quittance_details_service_1.quittance_details)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
