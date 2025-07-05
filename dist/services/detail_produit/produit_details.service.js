"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_details = produit_details;
const soap_service_1 = require("../soap.service");
async function produit_details(code, options, basecouvs, clauses) {
    const soapBody = {
        code, options, basecouvs, clauses
    };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Produit_Details");
    return result;
}
