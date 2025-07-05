"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_create = tiers_create;
const soap_service_1 = require("../soap.service");
async function tiers_create(typtiers, nature, numtiers, numdpp, data) {
    const soapBody = { typtiers, nature, numtiers, numdpp, data };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Tiers_Create");
    return result;
}
