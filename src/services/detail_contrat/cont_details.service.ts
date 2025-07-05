import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function cont_details(contrat: number, BasSecurityContext:any,
allpieces?:boolean,
detailadh?:boolean,
garanties?:boolean,
extensions?:boolean,
infoscieprod?:boolean,) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddInt("contrat",contrat)
   params.AddBool("allpieces",allpieces ?? false) 
 params.AddBool("detailadh",detailadh ?? false)
params.AddBool("garanties",garanties ?? false) 
   params.AddBool("extensions",extensions ?? false)
   params.AddBool("infoscieprod",infoscieprod ?? false)
  const result = await sendSoapRequest(params,"Cont_Details",BasSecurityContext);
  return result;
}