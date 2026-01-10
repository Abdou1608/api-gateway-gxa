"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produit_details = produit_details;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../../utils/groupByTypename"));
const soap_service_1 = require("../soap.service");
async function produit_details(code, BasSecurityContext, options, basecouv, clauses, ctx) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("code", code);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("options", options ?? true);
    params.AddBool("basecouv", basecouv ?? true);
    params.AddBool("clauses", clauses ?? true);
    //console.log("Paramettres du Detail du produit requis==="+JSON.stringify(params))
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Produit_Details", BasSecurityContext, "PROD", null, ctx);
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return grouped;
}
