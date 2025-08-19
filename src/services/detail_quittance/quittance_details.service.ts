import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function quittance_details(quittance: number, 
details:boolean,garanties:boolean,addinfospqg:boolean,intervenants:boolean,addinfosqint:boolean, BasSecurityContext:BasSecurityContext,) {
  const soapBody = {
	quittance,details, BasSecurityContext
  }
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddInt("quittance",quittance)
  // params.AddBool("composition",composition ?? false) 
 params.AddBool("details",details)
 params.AddBool("garanties",garanties)
 params.AddBool("addinfospqg",addinfospqg)
 params.AddBool("intervenants",intervenants)
 params.AddBool("addinfosqint",addinfosqint)
  const result = await sendSoapRequest(params, "Quittance_Details",BasSecurityContext);
  return result;
}