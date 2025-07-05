import { sendSoapRequest } from "../soap.service";


export async function tiers_create(typtiers : string,
	nature? : string, 
	numtiers?: number, 
	numdpp?: number,
	data ?: any) {
  const soapBody = {typtiers,nature,numtiers,numdpp,data}
  const result = await sendSoapRequest(soapBody,"Tiers_Create");
  return result;
}