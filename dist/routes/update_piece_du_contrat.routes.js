"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Update pièce du contrat
const express_1 = require("express");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const api_update_piece_contratValidator_1 = require("../validators/api_update_piece_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_update_piece_contratValidator_1.api_update_piece_contratValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const contrat = req.body.contrat;
    const produit = req.body.produit ? req.body.produit : undefined;
    const piece = req.body.piece;
    const Effet = req.body.effet ? req.body.effet : null;
    const data = req.body.data ? req.body.data : "";
    const response = await (0, cont_update_service_1.cont_piece_update)(contrat, produit, piece, Effet, data, _BasSecurityContext ?? req.body.basSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(response);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
