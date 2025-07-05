"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_details = produit_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function produit_details(code, options, basecouvs, clauses, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("code", code);
    // params.AddBool("composition",composition ?? false) 
    options ? params.AddBool("options", options) : null;
    params.AddBool("basecouvs", basecouvs ?? false);
    params.AddBool("clauses", clauses ?? false);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Produit_Details", BasSecurityContext);
    return result;
}
