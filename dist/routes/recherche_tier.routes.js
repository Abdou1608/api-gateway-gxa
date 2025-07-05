"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const tiers_search_service_1 = require("../services/liste_des_tiers/tiers_search.service");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.body.BasSecurityContext._SessionId;
    const reference = req.body.reference ?? "";
    const dppname = req.body.dppname ?? "";
    console.log("-----------------------------Données Reccus dans Recherche Tier Route req.body.SessionId ==" + req.body.BasSecurityContext._SessionId);
    try {
        const result = await (0, tiers_search_service_1.tiers_search)(_BasSecurityContext, reference, dppname);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.default = router;
