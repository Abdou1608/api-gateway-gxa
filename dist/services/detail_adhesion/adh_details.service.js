"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adh_details = adh_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function adh_details(body, bss) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", bss.ToSoapVar());
    params.AddInt("adhesion", body.adhesion);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Adh_Details", bss);
    return result;
}
