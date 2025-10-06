"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_create = tiers_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function tiers_create(basec, typtiers, nature, numtiers, numdpp, data, ctx) {
    //const soapBody = {typtiers,nature,numtiers,numdpp,data}
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", basec.ToSoapVar());
    numtiers ? params.AddInt("numtiers", numtiers) : null;
    numdpp ? params.AddInt("numdpp", numdpp) : null;
    nature ? params.AddString("nature", nature) : null;
    params.AddString("typtiers", typtiers);
    //if (data) {
    //	params.AddStr("data",tierModelToXml(data))	}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tiers_Create", basec, "tiers", data, ctx);
    return result;
}
