import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import groupByTypename from "../../utils/groupByTypename";
import { quietWarn } from "../../utils/quiet-log";
import { sendSoapRequest } from "../soap.service";


export async function cont_details(
contrat: number,
bss: BasSecurityContext,
Garanties?: boolean,
Extensions?: boolean,
clauses?: boolean,
Allpieces?: boolean,
Detailadh?: boolean,
infosCieProd?: boolean,
  
  ctx?: { userId?: string; domain?: string; password?: string }
) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",bss.ToSoapVar())
//  const contratId = typeof contrat === 'string' ? Number(contrat) : contrat;
   params.AddInt("contrat",contrat)
 //  params.AddBool("Allpieces",Allpieces ?? true) 
 //params.AddBool("Detailadh",Detailadh ?? true)
//params.AddBool("Garanties",Garanties ?? true) 
//   params.AddBool("Extensions",Extensions ?? true)
//   params.AddBool("infosCieProd",infosCieProd ?? false)
 //  params.AddBool("clauses",clauses ?? true)
 

  quietWarn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Paramettres du Detail du contrat requis==="+JSON.stringify(params));
  const result = await sendSoapRequest(params, "Cont_Details", bss, "Cont", null, ctx);
  const grouped = groupByTypename(result, { keepUnknown: true });
  return grouped;
}
