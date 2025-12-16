"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_garanti_create = cont_garanti_create;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const soap_service_1 = require("./soap.service");
async function cont_garanti_create(basSecurityContext, contrat, adhesion, piece, data, ctx) {
    //const soapBody = {typtiers,nature,numtiers,numdpp,data}
    const params = new BasParams_1.BasParams();
    basSecurityContext ? params.AddStr("BasSecurityContext", basSecurityContext?.ToSoapVar()) : null;
    params.AddInt("contrat", contrat);
    if (adhesion) {
        params.AddInt("adhesion", adhesion);
    }
    if (piece) {
        params.AddInt("piece", piece);
    }
    //if (data) {
    //	params.AddStr("data",tierModelToXml(data))	}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_add_garantis", basSecurityContext, "Garan", data, ctx);
    //const resp= await tiers_details(basec, result.Numtiers, true, true, ctx);
    return result;
}
