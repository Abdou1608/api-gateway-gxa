import { sendSoapRequest } from '../soap.service';

export async function produit_listitems(typeecran? : string,
	branche? : string,
	disponible? : boolean, BasSecurityContext?:any,) {
  const soapBody = {typeecran,branche,disponible,BasSecurityContext}
  const result = await sendSoapRequest(soapBody, "Produit_ListItems",BasSecurityContext);
  return result;
}