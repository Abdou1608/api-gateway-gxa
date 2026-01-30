"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrats_search = contrats_search;
exports.transformSearchResultToContArray = transformSearchResultToContArray;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const soap_service_1 = require("./soap.service");
async function contrats_search(BasSecurityContext, reference, ctx) {
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    if (reference != "" && reference != null) {
        const ref = `%${reference}%`;
        params.AddString("reference", ref);
    }
    //  params.AddString("typetiers",_typetiers)
    params.AddString("datanode", "");
    // const soapBody = {reference,dppname,typetiers,codp,datenais}
    let result;
    result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Search", BasSecurityContext, "searchresult", undefined, ctx);
    // const toreturn=  groupByTypename(result, { keepUnknown: true });
    return transformSearchResultToContArray(result);
}
function transformSearchResultToContArray(input) {
    if (!input || typeof input !== "object")
        return [];
    const items = Array.isArray(input.searchresult) ? input.searchresult : [];
    const typename = typeof input.target === "string" ? input.target.toLowerCase() : null;
    return items.map((item) => {
        const out = {};
        // Champs présents dans la source
        out.Contrat = item?.contrat ?? null;
        out.Derpiece = item?.derpiece ?? null;
        out.Intitule = item?.intitule ?? null;
        out.Numtiers = item?.numtiers ?? null;
        out.Ext_piec_codeprod = item?.ext_piec_codeprod ?? null;
        out.Ext_piec_sitpiece = item?.ext_piec_sitpiece ?? null;
        out.Ext_piec_datesit = item?.ext_piec_datesit ?? null;
        out.Ext_prod_libelle = item?.ext_prod_libelle ?? null;
        out.Ext_prod_branche = item?.ext_prod_branche ?? null;
        out.Ext_prod_branc = item?.ext_prod_branc ?? null;
        // police + ext_poli_police (si présent)
        if (item?.police !== undefined && item?.police !== null) {
            const p = String(item.police);
            out.Polinter = p;
            out.police = p;
            out.Police = p;
            out.ext_poli_police = p;
        }
        out.originRows = item?.originRows ?? null;
        return out;
    });
}
