"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_details = cont_details;
const soap_service_1 = require("../soap.service");
async function cont_details(contrat, allpieces, detailadh, garanties, extensions, infoscieprod) {
    const soapBody = {
        contrat, allpieces, detailadh, garanties, extensions, infoscieprod
    };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Cont_Details");
    return result;
}
