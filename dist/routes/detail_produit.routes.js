"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produit_details_service_1 = require("../services/detail_produit/produit_details.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_detail_produitValidator_1 = require("../validators/api_detail_produitValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_detail_produitValidator_1.api_detail_produitValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const code = req.body.code;
        const options = req.body.options ?? true;
        const basecouvs = req.body.basecouvs ?? true;
        const clauses = req.body.clauses ?? true;
        const result = await (0, produit_details_service_1.produit_details)(code, _BasSecurityContext, options, basecouvs, clauses);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
