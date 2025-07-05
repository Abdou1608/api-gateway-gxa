"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_details = quittance_details;
const soap_service_1 = require("../soap.service");
async function quittance_details(quittance, details) {
    const soapBody = {
        quittance, details
    };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Quittance_Details");
    return result;
}
