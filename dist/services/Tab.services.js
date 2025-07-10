"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab_ListValues = Tab_ListValues;
exports.Tab_ListItems = Tab_ListItems;
exports.Tab_GetValue = Tab_GetValue;
const soap_service_1 = require("./soap.service");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
async function Tab_ListValues(BasSecurityContext, tabcode) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("tabcode", tabcode);
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_ListValues", BasSecurityContext);
    return result;
}
async function Tab_ListItems(BasSecurityContext, filtre) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    if (filtre) {
        params.AddString("filtre", filtre);
    }
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_ListItems", BasSecurityContext);
    return result;
}
async function Tab_GetValue(BasSecurityContext, tabcode, tabref) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("tabcode", tabcode);
    params.AddString("tabref", tabref);
    params.AddString("datanode", "tabs");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tab_GetValue", BasSecurityContext);
    return result;
}
