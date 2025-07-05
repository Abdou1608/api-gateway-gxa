"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = _;
const soap_service_1 = require("../soap.service");
async function _(body) {
    const soapBody = {};
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody);
    return result;
}
