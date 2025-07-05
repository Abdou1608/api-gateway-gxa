"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Ajouté Offre au projet
const express_1 = require("express");
const soap_service_1 = require("../services/soap.service");
const router = (0, express_1.Router)();
router.post('/new_offer', async (req, res) => {
    try {
        const response = await (0, soap_service_1.sendSoapRequest)(req.body, "ajouté_offre_au_projet");
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP request failed', details: error });
    }
});
exports.default = router;
