"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_update_service_1 = require("../services/update_tier/tiers_update.service");
const async_handler_1 = require("../middleware/async-handler");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.put('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const dossier = JSON.parse(req.body.dossier);
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const numtiers = req.body.numtiers ?? null;
    const numdpp = req.body.numdpp ?? null;
    const data = req.body.data;
    const result = await (0, tiers_update_service_1.tiers_update)(dossier, data, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
