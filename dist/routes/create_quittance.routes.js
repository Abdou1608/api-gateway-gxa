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
        const autocalcul = false;
        const affectation = true;
        const data = req.body.data;
        const result = await (0, quittance_create_service_1.quittance_create)(contrat, piece, bordereau, autocalcul, affectation, data, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
router.post('/autocalcule', (0, zodValidator_1.validateBody)(api_create_quittanceValidator_1.api_create_quittanceValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const contrat = req.body.contrat;
        const piece = req.body.piece;
        const bordereau = req.body.bordereau;
        const autocalcul = true;
        const affectation = true;
        const data = req.body.data;
        const datedebut = req.body.datedebut;
        const datedefin = req.body.datedefin;
        const result = await (0, quittance_create_service_1.quittance_create)(contrat, piece, bordereau, autocalcul, affectation, data, _BasSecurityContext, datedebut, datedefin);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
