"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Recherche Reglement
const express_1 = require("express");
const soap_service_1 = require("../services/soap.service");
const api_create_reglementValidator_1 = require("../validators/api_create_reglementValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_create_reglementValidator_1.api_create_reglementValidator), async (req, res) => {
    try {
        const response = await (0, soap_service_1.sendSoapRequest)(req.body);
        res.json(response);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
