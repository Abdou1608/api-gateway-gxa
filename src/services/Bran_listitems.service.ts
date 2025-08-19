
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';

export async function bran_listitems( BasSecurityContext?:BasSecurityContext) {

      
  //const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const params=new BasParams()
  BasSecurityContext ? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()) :null
 // typeecran ? params.AddString("typeecran",typeecran) :null
 //  branche? params.AddString("branche",branche):null
  // disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","bran")
  const result = await sendSoapRequest(params, "Bran_ListItems",BasSecurityContext,"bran");
  return result;
 
}