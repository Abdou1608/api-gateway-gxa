
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';

export async function catal_listitems(
  BasSecurityContext?: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {

      
  //const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const params=new BasParams()
  BasSecurityContext ? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()) :null
 // typeecran ? params.AddString("typeecran",typeecran) :null
 //  branche? params.AddString("branche",branche):null
  // disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","catal")
  const result = await sendSoapRequest(
    params,
    "Catal_ListItems",
    BasSecurityContext,
    "catal",
    undefined,
    ctx
  );
  return result;
 
}