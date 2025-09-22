"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kco_cashtransaction_service_1 = require("../services/create_reglement/kco_cashtransaction.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_create_reglementValidator_1 = require("../validators/api_create_reglementValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_create_reglementValidator_1.api_create_reglementValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const result = await (0, kco_cashtransaction_service_1.kco_cashtransaction)(req.body, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
