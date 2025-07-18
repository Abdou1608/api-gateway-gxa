"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_details_service_1 = require("../services/detail_tier/tiers_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_tierValidator_1 = require("../validators/api_detail_tierValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_tierValidator_1.api_detail_tierValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId ?? req.body.BasSecurityContext?.SessionId;
        const Dossier = req.body.Dossier ?? 0;
        const comp = req.body.composition ?? false;
        const ext = req.body.extentions ?? false;
        const result = await (0, tiers_details_service_1.tiers_details)(_BasSecurityContext, Dossier, comp, ext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message ?? error });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
