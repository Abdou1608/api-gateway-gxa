import { da } from "zod/v4/locales/index.cjs";
import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function cont_newpiece(
  contrat: number,
  produit?: string,
  effet?: any,
  data?: any,
  FinEffet?: any,
  datedefin?: any,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
)  {
 const params=new BasParams()
 BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
 params.AddInt("contrat",contrat)
 produit ? params.AddString("produit",produit) : params.AddString("produit",data?.Produit)
 effet ? params.AddDateTime("effet",new Date(effet)) : data?.effet ? params.AddDateTime("effet",new Date(data?.effet)) : null
 FinEffet ? params.AddDateTime("FinEffet",new Date(FinEffet)) :data?.FinEffet ? params.AddDateTime("FinEffet",data?.FinEffet) : datedefin ? params.AddDateTime("FinEffet",new Date(datedefin)) : data?.datefin ? params.AddDateTime("FinEffet",new Date(data?.datefin)) : data?.Finpiece ? params.AddDateTime("FinEffet",new Date(data?.Finpiece)) : null

 //data ? params.AddStr("data",data) : null
  const result = await sendSoapRequest(params, "Cont_NewPiece", BasSecurityContext, "cont", data, ctx);
 // const newresult=await parseXml(result)
  return result;
}