import { BasParams } from "../Model/BasSoapObject/BasParams";
import {BasSecurityContext } from "../Model/BasSoapObject/BasSecurityContext";
import { Tier } from "../Model/tier.model";
import groupByTypename from "../utils/groupByTypename";
import { sendSoapRequest } from "./soap.service";


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


  return items.map((item: { contrat: null; derpiece: null; intitule: null; police: null | undefined; }) => {
    const out: any = {};

    // Champs présents dans la source
    out.Contrat = item?.contrat ?? null;
    out.Derpiece = item?.derpiece ?? null;
    out.Intitule = item?.intitule ?? null;

    // police + ext_poli_police (si présent)
    if (item?.police !== undefined && item?.police !== null) {
      const p = String(item.police);
      out.Polinter = p;
      out.police = p;
      out.Police= p;
      out.ext_poli_police = p;
    }

    return out;
  });
}



