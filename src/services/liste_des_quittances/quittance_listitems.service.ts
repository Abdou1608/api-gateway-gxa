import { sendSoapRequest } from '../soap.service';

export async function quittance_listitems(dossier:number,
contrat?: number,BasSecurityContext?:any,) {
  const soapBody = {dossier,contrat,BasSecurityContext}
  const result = await sendSoapRequest(soapBody,"Quittance_ListItems",BasSecurityContext);
  return result;
}