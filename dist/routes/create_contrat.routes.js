"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_create_service_1 = require("../services/create_contrat/cont_create.service");
const router = (0, express_1.Router)();
router.post('/cont-create', async (req, res) => {
    try {
        const result = await (0, cont_create_service_1.cont_create)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
