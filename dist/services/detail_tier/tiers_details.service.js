"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_details = tiers_details;
const soap_service_1 = require("../soap.service");
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../../utils/groupByTypename"));
async function tiers_details(BasSecurityContext, Dossier, composition, extensions) {
    // const soapBody = {BasSecurityContext:BasSec.ToSoapVar(),Dossier,composition,extensions}
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("Dossier", Dossier);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("composition", true);
    params.AddBool("extensions", extensions ?? false);
    params.AddString("ListeEntites", "CLI, SAL,DPP");
    params.AddString("datanode", "Tiers");
    //console.log("BasSecurityContext in tiers_detail service ===="+JSON.stringify( BasSecurityContext))
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tiers_Details", BasSecurityContext, "Tiers");
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return grouped;
}
