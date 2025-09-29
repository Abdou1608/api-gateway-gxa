"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksession_ = checksession_;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function checksession_(bassecuritycontext) {
    const params = new BasParams_1.BasParams();
    bassecuritycontext ? params.AddStr("BasSecurityContext", bassecuritycontext.ToSoapVar()) : null;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "CheckSession", bassecuritycontext);
    return result;
}
