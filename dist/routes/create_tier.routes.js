"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_create_service_1 = require("../services/create_tier/tiers_create.service");
const validators_1 = require("../validators/");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(validators_1.api_Create_tierValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const typtiers = req.body.typtiers;
    const nature = req.body.nature;
    const numtiers = req.body.numtiers ?? null;
    const numdpp = req.body.numdpp ?? null;
    const data = req.body.data;
    const result = await (0, tiers_create_service_1.tiers_create)(_BasSecurityContext, typtiers, nature, numtiers, numdpp, data, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
