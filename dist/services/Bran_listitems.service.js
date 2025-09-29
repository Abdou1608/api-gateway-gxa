"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bran_listitems = bran_listitems;
const soap_service_1 = require("./soap.service");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
async function bran_listitems(BasSecurityContext, ctx) {
    //const soapBody = {typeecran,branche,disponible,BasSecurityContext}
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    // typeecran ? params.AddString("typeecran",typeecran) :null
    //  branche? params.AddString("branche",branche):null
    // disponible ?  params.AddBool("disponible",disponible) :null
    params.AddString("datanode", "bran");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Bran_ListItems", BasSecurityContext, "bran", undefined, ctx);
    return result;
}
