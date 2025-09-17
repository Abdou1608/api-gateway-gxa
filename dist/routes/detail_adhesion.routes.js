"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_adhesionValidator_1 = require("../validators/api_detail_adhesionValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const adh_details_service_1 = require("../services/detail_adhesion/adh_details.service");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_adhesionValidator_1.api_detail_adhesionValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const result = await (0, adh_details_service_1.adh_details)(req.body, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
