"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const api_contrat_updateValidator_1 = require("../validators/api_contrat_updateValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.put('/', (0, zodValidator_1.validateBody)(api_contrat_updateValidator_1.api_contrat_updateValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const dossier = req.body.dossier;
        const produit = req.body.produit;
        const effet = req.body.effet;
        const data = req.body.data;
        const result = await (0, cont_update_service_1.cont_update)(dossier, produit, effet, data, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
