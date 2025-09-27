"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Liste des Reglements
const express_1 = require("express");
const soap_service_1 = require("../services/soap.service");
const router = (0, express_1.Router)();
router.post('/', async (req, res, next) => {
    try {
        const response = await (0, soap_service_1.sendSoapRequest)(req.body);
        res.json(response);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
