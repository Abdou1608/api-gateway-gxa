import { BasParams } from "../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../Model/BasSoapObject/BasSecurityContext";
import { tiers_details } from "./detail_tier/tiers_details.service";
import { sendSoapRequest } from "./soap.service";

export async function cont_clause_create(
basSecurityContext: BasSecurityContext, contrat: number, piece?: number, adhesion?: number, data?: any, ctx?: { userId?: string; domain?: string; password?: string; }) {
  //const soapBody = {typtiers,nature,numtiers,numdpp,data}
  const params=new BasParams()
  basSecurityContext ?  params.AddStr("BasSecurityContext",basSecurityContext?.ToSoapVar()) :null
 params.AddInt("Contrat",contrat)
  if(piece){
	  params.AddInt("Piece",piece)
  }	
  if(adhesion){
	  params.AddInt("Adhesion",adhesion)
  }
	
	//if (data) {
	//	params.AddStr("data",tierModelToXml(data))	}
  
	const result = await sendSoapRequest(params, "Cont_add_clauses", basSecurityContext, "Clause", data, ctx);
	//const resp= await tiers_details(basec, result.Numtiers, true, true, ctx);
  return result;
}