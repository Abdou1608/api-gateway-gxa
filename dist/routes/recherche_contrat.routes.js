"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const __service_1 = require("../services/recherche_contrat/_.service");
const router = (0, express_1.Router)();
router.post('/-', async (req, res) => {
    try {
        const result = await (0, __service_1._)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
