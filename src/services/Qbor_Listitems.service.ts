
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

export async function Qbor_Listitems(
  BasSecurityContext?: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {

      
  //const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const params=new BasParams()
  BasSecurityContext ? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()) :null
 // typeecran ? params.AddString("typeecran",typeecran) :null
 //  branche? params.AddString("branche",branche):null
  // disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","qbor")
  const result = await sendSoapRequest(
    params,
    "Qbor_Listitems",
    BasSecurityContext,
    "qbor",
    undefined,
    ctx
  );
const grouped = groupByTypename(result, { keepUnknown: true });
 
  return result;
 
}