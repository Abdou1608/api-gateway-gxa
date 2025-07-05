"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xtlog_search = xtlog_search;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function xtlog_search(BasSecurityContext, username, domain) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("login", username);
    params.AddString("domain", domain);
    params.AddString("datanode", "xtlog");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Xtlog_Get", BasSecurityContext).then(a => { return a; });
    return result;
}
