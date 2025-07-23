import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function tiers_update(dossier: number,
data : any, Bsec:BasSecurityContext) {
  const soapBody = {dossier,data}
  const result = await sendSoapRequest(soapBody, "Tiers_Update",Bsec);
  return result;
}