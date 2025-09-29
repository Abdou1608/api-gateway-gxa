"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_update = tiers_update;
const soap_service_1 = require("../soap.service");
async function tiers_update(dossier, data, Bsec, ctx) {
    const soapBody = { dossier, data };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Tiers_Update", Bsec, undefined, data, ctx);
    return result;
}
