"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_details_service_1 = require("../services/detail_contrat/cont_details.service");
const router = (0, express_1.Router)();
router.post('/cont-details', async (req, res) => {
    try {
        const result = await (0, cont_details_service_1.cont_details)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
