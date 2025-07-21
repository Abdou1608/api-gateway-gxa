"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_details = produit_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function produit_details(code, BasSecurityContext, options, basecouvs, clauses) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("code", code);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("options", options ?? true);
    params.AddBool("basecouvs", basecouvs ?? false);
    params.AddBool("clauses", clauses ?? true);
    console.log("Paramettres du Detail du produit requis===" + JSON.stringify(params));
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Produit_Details", BasSecurityContext, "produit");
    return result;
}
