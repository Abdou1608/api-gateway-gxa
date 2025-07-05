"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_newpiece = cont_newpiece;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const xml_parser_1 = require("../../utils/xml-parser");
const soap_service_1 = require("../soap.service");
async function cont_newpiece(contrat, produit, effet, data) {
    const params = new BasParams_1.BasParams();
    params.AddInt("dossier", contrat);
    produit ? params.AddString("produit", produit) : null;
    effet ? params.AddDateTime("effet", effet) : null;
    data ? params.AddStr("data", data) : null;
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Newpiece");
    const newresult = await (0, xml_parser_1.parseXml)(result);
    return newresult;
}
