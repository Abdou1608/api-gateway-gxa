"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_listitems = produit_listitems;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function produit_listitems(typeecran, branche, disponible, BasSecurityContext, ctx) {
    const soapBody = { typeecran, branche, disponible, BasSecurityContext };
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    typeecran ? params.AddString("typeecran", typeecran) : null;
    branche ? params.AddString("branche", branche) : null;
    disponible ? params.AddBool("disponible", disponible) : null;
    params.AddString("datanode", "prod");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Produit_ListItems", BasSecurityContext, "prod", undefined, ctx);
    //const grouped = groupByTypename(result, { keepUnknown: true }); 
    return result;
}
