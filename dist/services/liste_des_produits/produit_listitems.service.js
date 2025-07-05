"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_listitems = produit_listitems;
const soap_service_1 = require("../soap.service");
async function produit_listitems(typeecran, branche, disponible, BasSecurityContext) {
    const soapBody = { typeecran, branche, disponible, BasSecurityContext };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Produit_ListItems", BasSecurityContext);
    return result;
}
