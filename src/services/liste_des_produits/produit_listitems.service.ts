import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function produit_listitems(typeecran? : string,
	branche? : string,
	disponible? : boolean, BasSecurityContext?:BasSecurityContext) {
  const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const params=new BasParams()
  BasSecurityContext ? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()) :null
  typeecran ? params.AddString("typeecran",typeecran) :null
   branche? params.AddString("branche",branche):null
   disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","prod")
  const result = await sendSoapRequest(params, "Produit_ListItems",BasSecurityContext);
  return result;
}