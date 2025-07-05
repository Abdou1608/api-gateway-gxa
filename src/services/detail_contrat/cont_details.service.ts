import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function cont_details(body:any,) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",body.BasSecurityContext.ToSoapVar())
   params.AddInt("contrat",body.contrat)
   params.AddBool("allpieces",body.allpieces ?? false) 
 params.AddBool("detailadh",body.detailadh ?? false)
params.AddBool("garanties",body.garanties ?? false) 
   params.AddBool("extensions",body.extensions ?? false)
   params.AddBool("infoscieprod",body.infoscieprod ?? false)
  const result = await sendSoapRequest(params,"Cont_Details",body.BasSecurityContext);
  return result;
}