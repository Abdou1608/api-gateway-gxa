"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_newpiece = cont_newpiece;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_newpiece(contrat, produit, effet, data, FinEffet, datedefin, BasSecurityContext, ctx) {
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("contrat", contrat);
    produit ? params.AddString("produit", produit) : params.AddString("produit", data?.Produit);
    effet ? params.AddDateTime("effet", new Date(effet)) : data?.effet ? params.AddDateTime("effet", new Date(data?.effet)) : null;
    FinEffet ? params.AddDateTime("FinEffet", new Date(FinEffet)) : data?.FinEffet ? params.AddDateTime("FinEffet", data?.FinEffet) : datedefin ? params.AddDateTime("FinEffet", new Date(datedefin)) : data?.datefin ? params.AddDateTime("FinEffet", new Date(data?.datefin)) : data?.Finpiece ? params.AddDateTime("FinEffet", new Date(data?.Finpiece)) : null;
    //data ? params.AddStr("data",data) : null
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_NewPiece", BasSecurityContext, "cont", data, ctx);
    // const newresult=await parseXml(result)
    return result;
}
