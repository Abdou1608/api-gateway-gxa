"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_listitems = quittance_listitems;
const soap_service_1 = require("../soap.service");
async function quittance_listitems(dossier, contrat, BasSecurityContext) {
    const soapBody = { dossier, contrat, BasSecurityContext };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Quittance_ListItems", BasSecurityContext);
    return result;
}
