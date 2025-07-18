"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_create_service_1 = require("../services/create_quittance/quittance_create.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_create_quittanceValidator_1 = require("../validators/api_create_quittanceValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_create_quittanceValidator_1.api_create_quittanceValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const contrat = req.body.contrat;
        const piece = req.body.piece;
        const bordereau = req.body.bordereau;
        const effet = req.body.effet;
        const data = req.body.data;
        const result = await (0, quittance_create_service_1.quittance_create)(contrat, piece, bordereau, effet, data, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
