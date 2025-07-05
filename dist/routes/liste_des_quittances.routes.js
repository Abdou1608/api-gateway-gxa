"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_listitems_service_1 = require("../services/liste_des_quittances/quittance_listitems.service");
const router = (0, express_1.Router)();
router.post('/quittance-listitems', async (req, res) => {
    try {
        const result = await (0, quittance_listitems_service_1.quittance_listitems)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
