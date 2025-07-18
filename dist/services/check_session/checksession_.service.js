"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksession_ = checksession_;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function checksession_(bassecuritycontext) {
    const params = new BasParams_1.BasParams();
    params.AddString("BasSecuritycontext", bassecuritycontext.ToSoapVar());
    params.AddString("basSecuritycontext", bassecuritycontext.ToSoapVar());
    const result = await (0, soap_service_1.sendSoapRequest)(params, "checksession");
    return result;
}
