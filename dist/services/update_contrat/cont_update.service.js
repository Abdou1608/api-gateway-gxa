"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_update = cont_update;
exports.cont_piece_update = cont_piece_update;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_update(contrat, piece, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("contrat", contrat);
    piece ? params.AddInt("piece", piece) : null;
    // effet ? params.AddDateTime("effet",effet) : null
    // data ? params.AddStr("data",contModelToXml(data)) :null
    //console.log("££££££££===========DATA"+JSON.stringify( data))
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Update", BasSecurityContext, "", data);
    return result;
}
async function cont_piece_update(contrat, produit, piece, Effet, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("contrat", contrat);
    if (piece) {
        params.AddInt("piece", piece);
    }
    params.AddString("produit", produit);
    if (Effet) {
        params.AddDateTime("Effet", Effet);
    }
    // effet ? params.AddDateTime("effet",effet) : null
    data ? params.AddString("data", data) : null;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Updatepiece", BasSecurityContext, "", data);
    return result;
}
