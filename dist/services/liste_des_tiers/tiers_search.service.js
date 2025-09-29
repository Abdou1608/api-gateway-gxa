"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_search = tiers_search;
const soap_service_1 = require("../soap.service");
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
async function tiers_search(BasSecurityContext, reference, dppname, typetiers, ntel, datenais, rsociale, ctx) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    if (reference != "" && reference != null) {
        params.AddString("reference", reference);
    }
    if (rsociale != "" && rsociale != null) {
        params.AddString("rsociale", rsociale);
    }
    if (dppname != "" && dppname != null) {
        params.AddString("dppname", dppname);
    }
    const _typetiers = typetiers ?? "";
    const _ntel = ntel ?? "";
    const _datenais = datenais ?? "";
    if (_typetiers !== "" && _typetiers !== null) {
        params.AddString("typetiers", "_typetiers");
    }
    if (_ntel !== "" && _ntel !== null) {
        params.AddString("ntel", _ntel);
    }
    if (_datenais !== "" && _datenais !== null) {
        params.AddString("datenais", _datenais);
    }
    //  params.AddString("typetiers",_typetiers)
    params.AddString("datanode", "");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    let result;
    result = await (0, soap_service_1.sendSoapRequest)(params, "Tiers_Search", BasSecurityContext, undefined, undefined, ctx);
    return result;
}
