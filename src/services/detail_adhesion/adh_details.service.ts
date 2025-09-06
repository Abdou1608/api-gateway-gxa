import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import groupByTypename from "../../utils/groupByTypename";
import { sendSoapRequest } from "../soap.service";


export async function adh_details(body:any,bss:BasSecurityContext) {

  const params=new BasParams()
  params.AddStr("BasSecurityContext",bss.ToSoapVar())
   params.AddInt("adhesion",body.adhesion)
  
  const result = await sendSoapRequest(params,"Adh_Details",bss);
  const grouped = groupByTypename(result, { keepUnknown: true });
  return grouped;
}