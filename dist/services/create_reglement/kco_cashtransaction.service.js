"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kco_cashtransaction = kco_cashtransaction;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function kco_cashtransaction(body, BasSecurityContext, ctx) {
    let kco_body = body;
    kco_body.typeenc = "enc";
    const soapBody = kco_body;
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("typeoperation", soapBody.typeoperation);
    params.AddString("typeenc", soapBody.typeenc);
    params.AddInt("targetkind", soapBody.targetkind);
    params.AddString("targetqintid", soapBody.targetqintid);
    params.AddInt("montant", soapBody.montant);
    params.AddString("devise", soapBody.devise);
    params.AddString("date", soapBody.date);
    params.AddDateTime("dateeff", soapBody.dateff);
    params.AddString("typeoperation", soapBody.typeoperation);
    params.AddString("tierspayeur", soapBody.tierspayeur ?? "");
    params.AddString("reference", soapBody.reference);
    params.AddStr("data", body.data);
    //={
    //  typeoperation,typeenc,targetkind,targetqintid,montant,devise,date,dateff,reference,tierspayeur}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Kco_CashTransaction", BasSecurityContext, undefined, undefined, ctx);
    return result;
}
