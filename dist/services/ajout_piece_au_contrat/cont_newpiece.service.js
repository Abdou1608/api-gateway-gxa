"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_newpiece = cont_newpiece;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_newpiece(contrat, produit, effet, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("dossier", contrat);
    produit ? params.AddString("produit", produit) : null;
    effet ? params.AddDateTime("effet", effet) : null;
    //data ? params.AddStr("data",data) : null
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Newpiece", BasSecurityContext, data);
    // const newresult=await parseXml(result)
    return result;
}
