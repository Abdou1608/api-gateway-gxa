"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Risk_ListItems = Risk_ListItems;
exports.Risk_Create = Risk_Create;
exports.Risk_Update = Risk_Update;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Risk_ListItems(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddInt("contrat", req.body.contrat);
    params.AddInt("piece", req.body.piece);
    params.AddString("datanode", "risks");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Risk_ListItems", basSecurityContext, "risks", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
async function Risk_Create(req, res) {
    const params = new BasParams_1.BasParams();
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    if (req.body.contrat) {
        params.AddInt("contrat", req.body.contrat);
    }
    if (req.body.piece) {
        params.AddInt("piece", req.body.piece);
    }
    if (req.body.dateEntree && typeof req.body.dateEntree !== 'string') {
        params.AddDateTime("dateEntree", req.body.dateEntree);
    }
    else if (req.body.dateEntree && typeof req.body.dateEntree === 'string') {
        params.AddStrDate("dateEntree", req.body.dateEntree);
    }
    else {
        params.AddDateTime("dateEntree", new Date());
    }
    params.AddString("datanode", "Risk");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Risk_Create", basSecurityContext, "risk", req.body.data, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
async function Risk_Update(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    if (req.body.contrat) {
        params.AddInt("contrat", req.body.contrat);
    }
    if (req.body.piece) {
        params.AddInt("piece", req.body.piece);
    }
    if (req.body.adhesion) {
        params.AddInt("adhesion", req.body.adhesion);
    }
    if (req.body.dateEntree && typeof req.body.dateEntree !== 'string') {
        //  params.AddInt("dateEntree",req.body.dateEntree ) }
        params.AddDateTime("dateEntree", req.body.dateEntree);
    }
    else if (req.body.dateEntree && typeof req.body.dateEntree === 'string') {
        params.AddStrDate("dateEntree", req.body.dateEntree);
    }
    else {
        params.AddDateTime("dateEntree", new Date());
    }
    params.AddString("datanode", "Risk");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const garanties = req.body.data?.Garan ?? req.body.data?.garan;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Risk_Update", basSecurityContext, "risk", req.body.data, { userId: req.user?.sub, domain: req.body?.domain });
    // res.json(result);
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    if (garanties) {
        if (Array.isArray(garanties)) {
            const crated_garanties = await (0, soap_service_1.sendSoapRequest)(params, "Cont_add_garantis", basSecurityContext, "Garan", garanties, { userId: req.user?.sub, domain: req.body?.domain });
            grouped.GARANT = (0, groupByTypename_1.default)(crated_garanties, { keepUnknown: true });
        }
        else {
            const garanties_array = [garanties];
            const crated_garanties = await (0, soap_service_1.sendSoapRequest)(params, "Cont_add_garantis", basSecurityContext, "Garan", garanties_array, { userId: req.user?.sub, domain: req.body?.domain });
            grouped.GARANT = (0, groupByTypename_1.default)(crated_garanties, { keepUnknown: true });
        }
    }
    res.json(grouped);
}
