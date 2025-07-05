import { sendSoapRequest } from '../soap.service';

export async function tiers_update(dossier: number,
data : any) {
  const soapBody = {dossier,data}
  const result = await sendSoapRequest(soapBody, "Tiers_Update");
  return result;
}