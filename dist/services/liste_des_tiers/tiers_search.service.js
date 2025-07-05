"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_search = tiers_search;
const soap_service_1 = require("../soap.service");
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
async function tiers_search(BasSecurityContext, reference, dppname, typetiers, codp, datenais) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("reference", reference);
    params.AddString("dppname", dppname);
    const _typetiers = typetiers ?? "";
    params.AddString("typetiers", _typetiers);
    params.AddString("datanode", "");
    const soapBody = { reference, dppname, typetiers, codp, datenais };
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tiers_Search", BasSecurityContext);
    return result;
}
