"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kco_cashtransaction = kco_cashtransaction;
const soap_service_1 = require("../soap.service");
async function kco_cashtransaction(body, BasSecurityContext) {
    let kco_body = body;
    kco_body.typeenc = "enc";
    const soapBody = kco_body;
    //={
    //  typeoperation,typeenc,targetkind,targetqintid,montant,devise,date,dateff,reference,tierspayeur}
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Kco_CashTransaction", BasSecurityContext);
    return result;
}
