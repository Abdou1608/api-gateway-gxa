"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project_ListItemsHandler = Project_ListItemsHandler;
exports.Project_OfferListItemsHandler = Project_OfferListItemsHandler;
exports.Project_DetailHandler = Project_DetailHandler;
exports.Project_CreateHandler = Project_CreateHandler;
exports.Project_updateHandler = Project_updateHandler;
exports.Project_AddOfferHandler = Project_AddOfferHandler;
exports.Project_DeleteOfferHandler = Project_DeleteOfferHandler;
exports.Project_ValidateOfferHandler = Project_ValidateOfferHandler;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Project_ListItemsHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("dossier", req.body.dossier);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_ListItems", basSecurityContext, "projects", undefined, { userId: req.auth?.sid, domain: req.body?.domain });
    res.json(result);
}
;
async function Project_OfferListItemsHandler(req, res) {
    let params = new BasParams_1.BasParams();
    //const params = req.body;
    let _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    params.AddStr("BasSecurityContext", _BasSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    // params.AddInt("projet",req.body.projet)
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_OfferListItem", _BasSecurityContext, "Project", undefined, { userId: req.auth?.sid, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    res.json(grouped);
}
async function Project_DetailHandler(req, res) {
    let params = new BasParams_1.BasParams();
    //const params = req.body;
    let basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_Detail", basSecurityContext, "project", undefined, { userId: req.auth?.sid, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    res.json(grouped);
}
async function Project_CreateHandler(req, res) {
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
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_Create", basSecurityContext, "Project", data, { userId: req.auth?.sid, domain: req.body?.domain });
    res.json(result);
}
async function Project_updateHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    params.AddString("libelle", req.body.libelle);
    const data = req.body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_update", basSecurityContext, "project", data, { userId: req.auth?.sid, domain: req.body?.domain });
    res.json(result);
}
async function Project_AddOfferHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    // params.AddInt("dossier",req.body.dossier)
    params.AddString("produit", req.body.produit);
    // params.AddString("libelle",req.body.libelle)
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_AddOffer", basSecurityContext, "offer", undefined, { userId: req.auth?.sid, domain: req.body?.domain });
    res.json(result);
}
async function Project_DeleteOfferHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    params.AddInt("idoffer", req.body.idoffer);
    //  params.AddString("produit",req.body.produit)
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_DeleteOffer", basSecurityContext, "project", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
async function Project_ValidateOfferHandler(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("idproj", req.body.idproj);
    params.AddInt("idoffer", req.body.idoffer);
    params.AddString("defaut", req.body.defaut);
    params.AddBool("Avenant", req.body.Avenant);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_ValidateOffer", basSecurityContext, "Cont", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
