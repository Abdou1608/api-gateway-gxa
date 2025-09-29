"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_details_service_1 = require("../services/detail_contrat/cont_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_contratValidator_1 = require("../validators/api_detail_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_contratValidator_1.api_detail_contratValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const result = await (0, cont_details_service_1.cont_details)(req.body, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
