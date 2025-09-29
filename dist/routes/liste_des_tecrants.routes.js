"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Bran_listitems_service_1 = require("../services/Bran_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_bransValidator_1 = require("../validators/api_liste_des_bransValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_bransValidator_1.api_liste_des_bransValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    //console.log("-----------------------------Données Reccus Route listedesbrans req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
    const result = await (0, Bran_listitems_service_1.bran_listitems)(_BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
