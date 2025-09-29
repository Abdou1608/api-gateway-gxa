"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_listitems_service_1 = require("../services/liste_des_quittances/quittance_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_quittancesValidator_1 = require("../validators/api_liste_des_quittancesValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_quittancesValidator_1.api_liste_des_quittancesValidator), (0, async_handler_1.asyncHandler)(async (req, res) => {
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const dossier = req.body.dossier ?? req.body.Dossier ?? null;
    const contrat = req.body.contrat ?? req.body.Contrat ?? null;
    //console.log("dossier==="+dossier)
    const result = await (0, quittance_listitems_service_1.quittance_listitems)(dossier, contrat, _BasSecurityContext, { userId: req.user?.sub, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    res.json(grouped);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
