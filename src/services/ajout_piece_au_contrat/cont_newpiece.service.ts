import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { parseXml } from "../../utils/xml-parser";
import { sendSoapRequest } from "../soap.service";


export async function cont_newpiece(contrat:number,
produit?:string,
effet?:Date,
data?: string, BasSecurityContext?:any)  {
 const params=new BasParams()
 BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
 params.AddInt("dossier",contrat)
 produit ? params.AddString("produit",produit) : null
 effet ? params.AddDateTime("effet",effet) : null
 //data ? params.AddStr("data",data) : null
  const result = await sendSoapRequest(params, "Cont_Newpiece",BasSecurityContext,data);
 // const newresult=await parseXml(result)
  return result;
}