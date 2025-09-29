"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produit_listitems_service_1 = require("../services/liste_des_produits/produit_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_produitsValidator_1 = require("../validators/api_liste_des_produitsValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_produitsValidator_1.api_liste_des_produitsValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const branche = req.body.branche ?? null;
    const entites = req.body.extentions ?? null;
    const typeecran = req.body.typeecran ?? null;
    const disponible = req.body.disponible ?? true;
    console.log("-----------------------------Données Reccus Route listedesproduits req.body.BasSecurityContext ==" + JSON.stringify(req.body.BasSecurityContext));
    const result = await (0, produit_listitems_service_1.produit_listitems)(typeecran, branche, disponible, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
