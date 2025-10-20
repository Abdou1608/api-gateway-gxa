import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function cont_newpiece(
  contrat: number,
  produit?: string,
  effet?: any,
  data?: any,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
)  {
 const params=new BasParams()
 BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
 params.AddInt("contrat",contrat)
 produit ? params.AddString("produit",produit) : null
 effet ? params.AddDateTime("effet",new Date(effet)) : null
 //data ? params.AddStr("data",data) : null
  const result = await sendSoapRequest(params, "Cont_NewPiece", BasSecurityContext, "cont", data, ctx);
 // const newresult=await parseXml(result)
  return result;
}