import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import groupByTypename from "../../utils/groupByTypename";
import { sendSoapRequest } from "../soap.service";


export async function produit_details(
  code: string,
  BasSecurityContext: BasSecurityContext,
  options?: boolean,
  basecouvs?: boolean,
  clauses?: boolean,
  ctx?: { userId?: string; domain?: string; password?: string }
) {

  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("code",code)
  // params.AddBool("composition",composition ?? false) 
   params.AddBool("options",options ?? true)
params.AddBool("basecouv",basecouvs ?? true) 
 params.AddBool("clauses",clauses ?? true)
console.log("Paramettres du Detail du produit requis==="+JSON.stringify(params))
  const result = await sendSoapRequest(
    params,
    "Produit_Details",
    BasSecurityContext,
    "newprod",
    undefined,
    ctx
  );
  const grouped = groupByTypename(result, { keepUnknown: true});
  return grouped;
}