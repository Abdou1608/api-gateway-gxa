"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Risk_ListItems = Risk_ListItems;
exports.Risk_Create = Risk_Create;
exports.Risk_Update = Risk_Update;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
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
    if (req.body.dateEntree) {
        params.AddDateTime("dateEntree", req.body.dateEntree);
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
    if (req.body.dateEntree) {
        params.AddInt("dateEntree", req.body.dateEntree);
    }
    params.AddString("datanode", "Risk");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Risk_Update", basSecurityContext, "risk", req.body.data, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
