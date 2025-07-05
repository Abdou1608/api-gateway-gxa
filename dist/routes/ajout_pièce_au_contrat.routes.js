"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_newpiece_service_1 = require("../services/ajout_pi\u00E8ce_au_contrat/cont_newpiece.service");
const router = (0, express_1.Router)();
router.post('/cont-newpiece', async (req, res) => {
    try {
        const result = await (0, cont_newpiece_service_1.cont_newpiece)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error?.message });
    }
});
exports.default = router;
