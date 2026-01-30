import { BasParams } from "../Model/BasSoapObject/BasParams";
import {BasSecurityContext } from "../Model/BasSoapObject/BasSecurityContext";
import { Tier } from "../Model/tier.model";
import groupByTypename from "../utils/groupByTypename";
import { sendSoapRequest } from "./soap.service";
export interface ContratSearchResult {
  Contrat: string | null;
  Derpiece: string | null;
  Intitule: string | null;
  Police: string | null;
  Numtiers: number | null;
  ext_piec_codeprod: string | null;
  ext_piec_sitpiece: string | null;
  ext_piec_datesit: string | null;
            ext_prod_libelle: string | null;
            ext_prod_branche: string | null;
            ext_prod_branc: string | null;
            numtiers: string | null;
            originRows?: {
                origin: {
                    _: string | null;
                    maxpiece: string | null;
                } | null;
            } | null;
}

export async function contrats_search(
  BasSecurityContext: BasSecurityContext,
  reference: string,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
  if(reference!="" && reference!=null){
    const ref = `%${reference}%`;
    params.AddString("reference",ref)}
 
   //  params.AddString("typetiers",_typetiers)

   params.AddString("datanode","")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  let result:[any] 
   result = await sendSoapRequest(
     params,
     "Cont_Search",
     BasSecurityContext,
     "searchresult",
     undefined,
     ctx
   );
  // const toreturn=  groupByTypename(result, { keepUnknown: true });
   
  return transformSearchResultToContArray(result);
}
export function transformSearchResultToContArray(input: any) {
  if (!input || typeof input !== "object") return [];

  const items = Array.isArray(input.searchresult) ? input.searchresult : [];
  const typename = typeof input.target === "string" ? input.target.toLowerCase() : null;


  return items.map((item: any) => {
    const out: any = {};

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
      out.Police= p;
      out.ext_poli_police = p;
    }
    out.originRows = item?.originRows ?? null;

    return out;
  });
}



