"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qbor_Listitems = Qbor_Listitems;
const soap_service_1 = require("./soap.service");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Qbor_Listitems(BasSecurityContext, ctx) {
    //const soapBody = {typeecran,branche,disponible,BasSecurityContext}
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    // typeecran ? params.AddString("typeecran",typeecran) :null
    //  branche? params.AddString("branche",branche):null
    // disponible ?  params.AddBool("disponible",disponible) :null
    params.AddString("datanode", "qbor");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Qbor_Listitems", BasSecurityContext, "qbor", undefined, ctx);
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return result;
}
