"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_search_service_1 = require("../services/liste_des_contrats/cont_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_contratsValidator_1 = require("../validators/api_liste_des_contratsValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_contratsValidator_1.api_liste_des_contratsValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const reference = req.body.reference ?? "";
    const detailorigine = req.body.detailorigine;
    const origine = req.body.origine;
    const codefic = req.body.codefic ?? "";
    const nomchamp = req.body.nomchamp ?? "";
    const result = await (0, cont_search_service_1.cont_search)(reference, detailorigine, origine, codefic, nomchamp, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
