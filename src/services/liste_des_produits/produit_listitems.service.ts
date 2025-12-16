import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import groupByTypename from '../../utils/groupByTypename';
import { sendSoapRequest } from '../soap.service';

export async function produit_listitems(
  typeecran?: string,
  branche?: string,
  disponible?: boolean,
  BasSecurityContext?: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {

      
  const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const params=new BasParams()
  BasSecurityContext ? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()) :null
  typeecran ? params.AddString("typeecran",typeecran) :null
   branche? params.AddString("branche",branche):null
  disponible !== undefined ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","prod")
  const result = await sendSoapRequest(
    params,
    "Produit_ListItems",
    BasSecurityContext,
    "prod",
    undefined,
    ctx
  );
 //const grouped = groupByTypename(result, { keepUnknown: true }); 
  return result;

}