"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrats_search = contrats_search;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const soap_service_1 = require("./soap.service");
async function contrats_search(BasSecurityContext, reference, ctx) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    if (reference != "" && reference != null) {
        const ref = `%${reference}%`;
        params.AddString("reference", ref);
    }
    //  params.AddString("typetiers",_typetiers)
    params.AddString("datanode", "");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    let result;
    result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Search", BasSecurityContext, "searchresult", undefined, ctx);
    // const toreturn=  groupByTypename(result, { keepUnknown: true });
    return result;
}
