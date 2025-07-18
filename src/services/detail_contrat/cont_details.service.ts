import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function cont_details(body:any,bss:BasSecurityContext) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",bss.ToSoapVar())
   params.AddInt("contrat",body.contrat)
   params.AddBool("allpieces",body.allpieces ?? false) 
 params.AddBool("detailadh",body.detailadh ?? false)
params.AddBool("garanties",body.garanties ?? false) 
   params.AddBool("extensions",body.extensions ?? false)
   params.AddBool("infoscieprod",body.infoscieprod ?? false)
  const result = await sendSoapRequest(params,"Cont_Details",bss);
  return result;
}