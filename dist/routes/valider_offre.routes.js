"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Valider Offre(transformé projet en nouveau contrat ou nouvelle pièce)
const express_1 = require("express");
const soap_service_1 = require("../services/soap.service");
const api_projects_project_validateofferValidator_1 = require("../validators/api_projects_project_validateofferValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_projects_project_validateofferValidator_1.api_projects_project_validateofferValidator), async (req, res) => {
    try {
        const response = await (0, soap_service_1.sendSoapRequest)(req.body);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP request failed', details: error });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
