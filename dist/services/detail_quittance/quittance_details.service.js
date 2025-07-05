"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_details = quittance_details;
const soap_service_1 = require("../soap.service");
async function quittance_details(quittance, details, BasSecurityContext) {
    const soapBody = {
        quittance, details, BasSecurityContext
    };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Quittance_Details", BasSecurityContext);
    return result;
}
