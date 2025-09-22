"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_details_service_1 = require("../services/detail_contrat/cont_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_contratValidator_1 = require("../validators/api_detail_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_contratValidator_1.api_detail_contratValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const result = await (0, cont_details_service_1.cont_details)(req.body, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
