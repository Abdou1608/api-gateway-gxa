"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_details = cont_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_details(body, bss) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", bss.ToSoapVar());
    params.AddInt("contrat", body.contrat);
    params.AddBool("allpieces", body.allpieces ?? false);
    params.AddBool("detailadh", body.detailadh ?? false);
    params.AddBool("garanties", body.garanties ?? false);
    params.AddBool("extensions", body.extensions ?? false);
    params.AddBool("infoscieprod", body.infoscieprod ?? false);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Details", bss);
    return result;
}
