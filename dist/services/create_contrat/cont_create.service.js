"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_create = cont_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const cont_details_service_1 = require("../detail_contrat/cont_details.service");
const soap_service_1 = require("../soap.service");
async function cont_create(dossier, produit, effet, data, BasSecurityContext, ctx) {
    const params = new BasParams_1.BasParams();
    BasSecurityContext ? params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("dossier", dossier);
    produit ? params.AddString("produit", produit) : null;
    effet ? params.AddStrDate("effet", new Date(effet).toISOString().split('T')[0]) : params.AddStrDate("effet", new Date().toISOString().split('T')[0]);
    // data ? params.AddStr("data",contModelToXml(data)) :null
    console.log("££££££££===========DATA" + JSON.stringify(data));
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Create", BasSecurityContext, "cont", data, ctx);
    // console.log("$$$$$$$$$ RESULT CREATE CONTRAT "+JSON.stringify(result))
    if (!result?.error) {
        const resultData = result["piec"];
        //  console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT Objet"+JSON.stringify(resultData))
        //  console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT  "+(resultData.contrat))
        if (!resultData) {
            console.error("No data in response");
            return { error: "No data in response" };
        }
        const contCreateResult = await (0, cont_details_service_1.cont_details)({ contrat: resultData.contrat }, BasSecurityContext);
        // console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT  contCreateResult==="+JSON.stringify(contCreateResult))
        return contCreateResult;
        //  const grouped = groupByTypename(contCreateResult, { keepUnknown: true });
        //  return grouped;
    }
    else {
        return result;
    }
}
