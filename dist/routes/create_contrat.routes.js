"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_create_service_1 = require("../services/create_contrat/cont_create.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_create_contratValidator_1 = require("../validators/api_create_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_create_contratValidator_1.api_create_contratValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const dossier = req.body.dossier;
    const produit = req.body.produit;
    const effet = req.body.effet;
    const data = req.body.data;
    const result = await (0, cont_create_service_1.cont_create)(dossier, produit, effet, data, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
