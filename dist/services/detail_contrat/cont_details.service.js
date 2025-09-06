"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_details = cont_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../../utils/groupByTypename"));
const soap_service_1 = require("../soap.service");
async function cont_details(body, bss) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", bss.ToSoapVar());
    params.AddInt("contrat", body.contrat);
    params.AddBool("allpieces", body.allpieces ?? true);
    params.AddBool("detailadh", body.detailadh ?? true);
    params.AddBool("garanties", body.garanties ?? true);
    params.AddBool("extensions", body.extensions ?? false);
    params.AddBool("infoscieprod", body.infoscieprod ?? false);
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Details", bss);
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return grouped;
}
