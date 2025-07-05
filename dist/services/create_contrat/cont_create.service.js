"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_create = cont_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_create(dossier, produit, effet, data) {
    const params = new BasParams_1.BasParams();
    params.AddInt("dossier", dossier);
    produit ? params.AddString("produit", produit) : null;
    effet ? params.AddDateTime("effet", effet) : null;
    data ? params.AddStr("data", data) : null;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Create");
    return result;
}
