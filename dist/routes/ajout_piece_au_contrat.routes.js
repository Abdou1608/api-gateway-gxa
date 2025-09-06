"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_newpiece_service_1 = require("../services/ajout_piece_au_contrat/cont_newpiece.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_ajout_piece_au_contratValidator_1 = require("../validators/api_ajout_piece_au_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_ajout_piece_au_contratValidator_1.api_ajout_piece_au_contratValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const contrat = req.body.contrat;
        const produit = req.body.produit;
        const effet = req.body.effet;
        const data = req.body.data;
        const result = await (0, cont_newpiece_service_1.cont_newpiece)(contrat, produit, effet, data, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error?.message, detail: JSON.stringify(error)
        });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
