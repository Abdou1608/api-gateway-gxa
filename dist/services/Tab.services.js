"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab_ListValues = Tab_ListValues;
exports.Tab_ListItems = Tab_ListItems;
exports.Tab_GetValue = Tab_GetValue;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Tab_ListValues(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddString("tabcode", req.body.tabcode);
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_ListValues", basSecurityContext, "tabs", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    // return grouped;
    res.json(grouped);
}
async function Tab_ListItems(req, res) {
    const params = new BasParams_1.BasParams();
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    if (req.body.filtre) {
        params.AddString("filtre", req.body.filtre);
    }
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_ListItems", basSecurityContext, "tab", undefined, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
async function Tab_GetValue(req, res) {
    const params = new BasParams_1.BasParams();
    //const params = req.body;
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
    params.AddString("tabcode", req.body?.tabcode);
    params.AddString("tabref", req.body?.tabref);
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_GetValue", basSecurityContext, undefined, undefined, { userId: req.user?.sub, domain: req.body?.domain });
    res.json(result);
}
