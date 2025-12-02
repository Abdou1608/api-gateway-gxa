"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_clause_create = cont_clause_create;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const soap_service_1 = require("./soap.service");
async function cont_clause_create(basec, data, ctx) {
    //const soapBody = {typtiers,nature,numtiers,numdpp,data}
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", basec.ToSoapVar());
    //if (data) {
    //	params.AddStr("data",tierModelToXml(data))	}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_add_clauses", basec, "CLAUSES", data, ctx);
    //const resp= await tiers_details(basec, result.Numtiers, true, true, ctx);
    return result;
}
