"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const router = (0, express_1.Router)();
router.post('/cont-update', async (req, res) => {
    try {
        const result = await (0, cont_update_service_1.cont_update)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
