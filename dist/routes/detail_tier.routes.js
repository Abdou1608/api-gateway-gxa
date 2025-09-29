"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_details_service_1 = require("../services/detail_tier/tiers_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_tierValidator_1 = require("../validators/api_detail_tierValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_tierValidator_1.api_detail_tierValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const Dossier = req.body.Dossier ?? req.body.dossier;
    const comp = req.body.composition ?? true;
    const ext = false;
    const result = await (0, tiers_details_service_1.tiers_details)(_BasSecurityContext, Dossier, comp, ext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
