import { BasParams } from "../Model/BasSoapObject/BasParams";
import {BasSecurityContext } from "../Model/BasSoapObject/BasSecurityContext";
import { Tier } from "../Model/tier.model";
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
     undefined,
     undefined,
     ctx
   );
  return result;
}