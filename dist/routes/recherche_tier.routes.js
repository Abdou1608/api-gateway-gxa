"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const tiers_search_service_1 = require("../services/liste_des_tiers/tiers_search.service");
const api_tiers_searchValidator_1 = require("../validators/api_tiers_searchValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_tiers_searchValidator_1.api_tiers_searchValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const reference = req.body.reference ?? "";
        const dppname = req.body.dppname ?? null;
        const ntel = req.body.ntel ?? null;
        const datenais = req.body.datenais ?? null;
        const typetiers = req.body.typetiers ?? null;
        const rsociale = req.body.rsociale ?? null;
        //console.log("-----------------------------Données Reccus dans Recherche Tier Route req.body.SessionId =="+ req.body.BasSecurityContext._SessionId)
        const result = await (0, tiers_search_service_1.tiers_search)(_BasSecurityContext, reference, dppname, ntel, datenais, typetiers, rsociale);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
