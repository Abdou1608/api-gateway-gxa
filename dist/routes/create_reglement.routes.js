"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kco_cashtransaction_service_1 = require("../services/create_reglement/kco_cashtransaction.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_create_reglementValidator_1 = require("../validators/api_create_reglementValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_create_reglementValidator_1.api_create_reglementValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const result = await (0, kco_cashtransaction_service_1.kco_cashtransaction)(req.body, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
