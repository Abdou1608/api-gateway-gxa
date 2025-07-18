"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_listitems = quittance_listitems;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function quittance_listitems(dossier, contrat, BasSecurityContext) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("dossier", dossier);
    params.AddInt("contrat", contrat);
    //   disponible ?  params.AddBool("disponible",disponible) :null
    params.AddString("datanode", "quit");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Quittance_ListItems", BasSecurityContext);
    return result;
}
