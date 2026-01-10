"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_clause_create = cont_clause_create;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const soap_service_1 = require("./soap.service");
async function cont_clause_create(basSecurityContext, contrat, piece, adhesion, data, ctx) {
    //const soapBody = {typtiers,nature,numtiers,numdpp,data}
    const params = new BasParams_1.BasParams();
    basSecurityContext ? params.AddStr("BasSecurityContext", basSecurityContext?.ToSoapVar()) : null;
    params.AddInt("Contrat", contrat);
    if (piece) {
        params.AddInt("Piece", piece);
    }
    if (adhesion) {
        params.AddInt("Adhesion", adhesion);
    }
    //if (data) {
    //	params.AddStr("data",tierModelToXml(data))	}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_add_clauses", basSecurityContext, "Clause", data, ctx);
    //const resp= await tiers_details(basec, result.Numtiers, true, true, ctx);
    return result;
}
