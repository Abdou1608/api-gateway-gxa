import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function produit_details(code : string,BasSecurityContext:BasSecurityContext,
	options? : boolean,
	basecouvs?: boolean,
	clauses? : boolean) {

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