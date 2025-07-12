"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_create_service_1 = require("../services/create_quittance/quittance_create.service");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const result = await (0, quittance_create_service_1.quittance_create)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
