import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function produit_details(code : string,
	options? : boolean,
	basecouvs?: boolean,
	clauses? : boolean,BasSecurityContext?:any,) {

  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("code",code)
  // params.AddBool("composition",composition ?? false) 
  options? params.AddBool("options",options):null
params.AddBool("basecouvs",basecouvs ?? false) 
   params.AddBool("clauses",clauses ?? false)

  const result = await sendSoapRequest(params,"Produit_Details",BasSecurityContext);
  return result;
}