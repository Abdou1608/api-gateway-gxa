"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_create = cont_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
const cont_to_xml_service_1 = require("./cont_to_xml.service");
async function cont_create(dossier, produit, effet, data, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("dossier", dossier);
    produit ? params.AddString("produit", produit) : null;
    effet ? params.AddDateTime("effet", effet) : null;
    if (data) {
        params.AddStr("data", (0, cont_to_xml_service_1.contModelToXml)(data));
    }
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Create", BasSecurityContext);
    return result;
}
