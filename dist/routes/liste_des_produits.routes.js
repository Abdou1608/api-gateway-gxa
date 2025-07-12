"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produit_listitems_service_1 = require("../services/liste_des_produits/produit_listitems.service");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const result = await (0, produit_listitems_service_1.produit_listitems)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
