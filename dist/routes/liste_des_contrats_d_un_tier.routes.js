"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_listitems_service_1 = require("../services/liste_des_contrats_d_un_tier/cont_listitems.service");
const router = (0, express_1.Router)();
router.post('/cont-listitems', async (req, res) => {
    try {
        const result = await (0, cont_listitems_service_1.cont_listitems)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
