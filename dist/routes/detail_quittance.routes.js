"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_details_service_1 = require("../services/detail_quittance/quittance_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_quittanceValidator_1 = require("../validators/api_detail_quittanceValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_quittanceValidator_1.api_detail_quittanceValidator), async (req, res, next) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const quittance = req.body.quittance;
        const details = req.body.details ?? true;
        const garanties = req.body.garanties ?? true;
        const addinfospqg = req.body.addinfospqg ?? true;
        const intervenants = req.body.intervenants ?? true;
        const addinfosqint = req.body.addinfosqint ?? true;
        const result = await (0, quittance_details_service_1.quittance_details)(quittance, details, garanties, addinfospqg, intervenants, addinfosqint, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
