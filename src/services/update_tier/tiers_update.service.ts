import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function tiers_update(
  dossier: number,
  data: any,
  Bsec: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
  const soapBody = {dossier,data}
  const result = await sendSoapRequest(soapBody, "Tiers_Update", Bsec, undefined, data, ctx);
  return result;
}