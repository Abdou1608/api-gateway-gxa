import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


interface kco {
  typeoperation:string,
  typeenc:string,
targetkind:any
,targetqintid: string
,montant:any
,devise:string
,date:string
,dateff:any
,reference?:any
,tierspayeur? : string
}
export async function kco_cashtransaction(
  body: any,
  BasSecurityContext: BasSecurityContext,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
let kco_body:kco = body
kco_body.typeenc="enc"
  const soapBody =kco_body
  const params=new BasParams()
  params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar())
  params.AddString("typeoperation",soapBody.typeoperation)
  params.AddString("typeenc",soapBody.typeenc)
  params.AddInt("targetkind",soapBody.targetkind)
  params.AddString("targetqintid",soapBody.targetqintid)
  params.AddInt("montant",soapBody.montant)
  params.AddString("devise",soapBody.devise)
  params.AddString("date",soapBody.date)
  params.AddDateTime("dateeff",soapBody.dateff)
     params.AddString("typeoperation", soapBody.typeoperation)
     params.AddString("tierspayeur", soapBody.tierspayeur ?? "")
     params.AddString("reference", soapBody.reference)
     params.AddStr("data", body.data)
  
  //={
  //  typeoperation,typeenc,targetkind,targetqintid,montant,devise,date,dateff,reference,tierspayeur}
 
  const result = await sendSoapRequest(
    params,
    "Kco_CashTransaction",
    BasSecurityContext,
    undefined,
    undefined,
    ctx
  );
  return result;
}