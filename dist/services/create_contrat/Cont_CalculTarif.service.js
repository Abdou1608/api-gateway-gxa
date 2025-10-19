"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cont_CalculTarif = Cont_CalculTarif;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function Cont_CalculTarif(contrat, piece, adhesion, BasSecurityContext, ctx) {
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("contrat", contrat);
    piece ? params.AddInt("piece", piece) : null;
    adhesion ? params.AddInt("adhesion", adhesion) : null;
    params.AddBool("details", true);
    // data ? params.AddStr("data",contModelToXml(data)) :null
    //console.log("££££££££===========DATA"+JSON.stringify( data))
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_CalculTarif", BasSecurityContext, "calcultarif", null);
    console.log("$$$$$$$$$ RESULT CREATE CONTRAT " + JSON.stringify(result));
    return result;
}
