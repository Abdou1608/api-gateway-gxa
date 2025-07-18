"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_details = quittance_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function quittance_details(quittance, details, BasSecurityContext) {
    const soapBody = {
        quittance, details, BasSecurityContext
    };
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("quittance", quittance);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("details", details);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Quittance_Details", BasSecurityContext);
    return result;
}
