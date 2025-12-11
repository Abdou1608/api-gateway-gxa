"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_listitems = quittance_listitems;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function quittance_listitems(dossier, contrat, BasSecurityContext, ctx) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    if (contrat) {
        const contratId = typeof contrat === 'string' ? Number(contrat) : contrat;
        params.AddInt("contrat", contratId);
    }
    if (dossier) {
        const dossierId = typeof dossier === 'string' ? Number(dossier) : dossier;
        params.AddInt("dossier", dossierId);
    }
    //   disponible ?  params.AddBool("disponible",disponible) :null
    params.AddString("datanode", "quit-rows");
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Quittance_ListItems", BasSecurityContext, "quit-rows", undefined, ctx);
    return result;
}
