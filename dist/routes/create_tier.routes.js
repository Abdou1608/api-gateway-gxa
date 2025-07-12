"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_create_service_1 = require("../services/create_tier/tiers_create.service");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const typtiers = req.body.typtiers;
        const nature = req.body.nature;
        const numtiers = req.body.numtiers;
        const numdpp = req.body.numdpp;
        const data = req.body.data;
        const result = await (0, tiers_create_service_1.tiers_create)(typtiers, nature, numtiers, numdpp, data);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
