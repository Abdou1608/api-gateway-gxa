import { sendSoapRequest } from "../soap.service";


interface kco {
  typeoperation:string,
  typeenc:string,
targetkind:any
,targetqintid: string
,montant:any
,devise:string
,date:string
,dateff:Date
,reference?:any
,tierspayeur? : string
}
export async function kco_cashtransaction(body:any,BasSecurityContext:any) {
let kco_body:kco = body
kco_body.typeenc="enc"
  const soapBody =kco_body
  
  //={
  //  typeoperation,typeenc,targetkind,targetqintid,montant,devise,date,dateff,reference,tierspayeur}
 
  const result = await sendSoapRequest(soapBody, "Kco_CashTransaction",BasSecurityContext);
  return result;
}