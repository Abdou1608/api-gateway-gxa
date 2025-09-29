"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_details = quittance_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../../utils/groupByTypename"));
const soap_service_1 = require("../soap.service");
async function quittance_details(quittance, details, garanties, addinfospqg, intervenants, addinfosqint, BasSecurityContext, ctx) {
    const soapBody = {
        quittance, details, BasSecurityContext
    };
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("quittance", quittance);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("details", details);
    params.AddBool("garanties", garanties);
    params.AddBool("addinfospqg", addinfospqg);
    params.AddBool("intervenants", intervenants);
    params.AddBool("addinfosqint", addinfosqint);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Quittance_Details", BasSecurityContext, undefined, undefined, ctx);
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return grouped;
}
