import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import groupByTypename from "../../utils/groupByTypename";
import { sendSoapRequest } from "../soap.service";


export async function cont_details(
  body: any,
  bss: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",bss.ToSoapVar())
  const contratId = typeof body.contrat === 'string' ? Number(body.contrat) : body.contrat;
   params.AddInt("contrat",contratId)
   params.AddBool("allpieces",body.allpieces ?? true) 
 params.AddBool("detailadh",body.detailadh ?? true)
params.AddBool("garanties",body.garanties ?? true) 
   params.AddBool("extensions",body.extensions ?? false)
   params.AddBool("infoscieprod",body.infoscieprod ?? false)
  const result = await sendSoapRequest(params, "Cont_Details", bss, undefined, undefined, ctx);
  const grouped = groupByTypename(result, { keepUnknown: true });
  return grouped;
}