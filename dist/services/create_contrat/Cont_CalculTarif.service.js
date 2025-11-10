"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cont_CalculTarif = Cont_CalculTarif;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const BasSecurityContext_1 = require("../../Model/BasSoapObject/BasSecurityContext");
const soap_service_1 = require("../soap.service");
async function Cont_CalculTarif(contrat, piece, adhesion, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt("contrat", contrat);
    piece ? params.AddInt("piece", piece) : null;
    adhesion ? params.AddInt("adhesion", adhesion) : null;
    params.AddBool("details", true);
    // data ? params.AddStr("data",contModelToXml(data)) :null
    //console.log("££££££££===========DATA"+JSON.stringify( data))
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_CalculTarif", ctx, "calcultarif", null);
    console.log("$$$$$$$$$ RESULT CREATE CONTRAT " + JSON.stringify(result));
    return result;
}
