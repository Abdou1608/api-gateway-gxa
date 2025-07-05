import { sendSoapRequest } from "../soap.service";


export async function quittance_details(quittance: number, 
details?:boolean,BasSecurityContext?:any,) {
  const soapBody = {
	quittance,details, BasSecurityContext
  }
  const result = await sendSoapRequest(soapBody, "Quittance_Details",BasSecurityContext);
  return result;
}