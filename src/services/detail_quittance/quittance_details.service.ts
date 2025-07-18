import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function quittance_details(quittance: number, 
details:boolean,BasSecurityContext:BasSecurityContext,) {
  const soapBody = {
	quittance,details, BasSecurityContext
  }
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddInt("quittance",quittance)
  // params.AddBool("composition",composition ?? false) 
 params.AddBool("details",details)

  const result = await sendSoapRequest(params, "Quittance_Details",BasSecurityContext);
  return result;
}