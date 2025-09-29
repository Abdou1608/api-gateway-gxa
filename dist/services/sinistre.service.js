"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinistre_ListItemsHandler = Sinistre_ListItemsHandler;
exports.Sinistre_DetailHandler = Sinistre_DetailHandler;
exports.Sinistre_CreateHandler = Sinistre_CreateHandler;
exports.Sinistre_updateHandler = Sinistre_updateHandler;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Sinistre_ListItemsHandler(req, res) {
    let params = new BasParams_1.BasParams();
    //const params = req.body;
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    params.AddStr("BasSecurityContext", _BasSecurityContext.ToSoapVar());
    const dossierId = typeof req.body.dossier === 'string' ? Number(req.body.dossier) : req.body.dossier;
    if (dossierId && dossierId > 0) {
        params.AddInt("dossier", dossierId);
    }
    const contraId = typeof req.body.contrat === 'string' ? Number(req.body.contrat) : req.body.contrat;
    const contrat = contraId;
    if (contrat && contrat > 0) {
        params.AddInt("contrat", req.body.contrat);
    }
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Sin_Listitems", _BasSecurityContext, "sins", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    res.json(grouped);
}
async function Sinistre_DetailHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    const sinistre = req.body.sinistre ?? 0;
    if (sinistre && sinistre > 0) {
        params.AddInt("sinistre", req.body.sinistre);
    }
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Sin_Details", basSecurityContext, "sin", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    res.json(grouped);
}
async function Sinistre_CreateHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    req.body.contrat ? params.AddInt("contrat", req.body.contrat) : null;
    params.AddInt("dossier", req.body.dossier);
    params.AddString("produit", req.body.produit);
    params.AddString("libelle", req.body.libelle);
    const data = req.body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Sin_Create", basSecurityContext, "Sinistre", data, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
async function Sinistre_updateHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    params.AddString("libelle", req.body.libelle);
    const data = req.body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Sin_update", basSecurityContext, "Sinistre", data, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
