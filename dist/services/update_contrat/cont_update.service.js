"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_update = cont_update;
exports.cont_piece_update = cont_piece_update;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_update(dossier, piece, effet, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("dossier", dossier);
    piece ? params.AddString("piece", piece) : null;
    effet ? params.AddDateTime("effet", effet) : null;
    // data ? params.AddStr("data",data) : null
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Update", BasSecurityContext, data);
    return result;
}
async function cont_piece_update(dossier, piece, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("dossier", dossier);
    params.AddString("piece", piece);
    // effet ? params.AddDateTime("effet",effet) : null
    // data ? params.AddStr("data",data) : null
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Updatepiece", BasSecurityContext, data);
    return result;
}
