import { BasParams } from "../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../Model/BasSoapObject/BasSecurityContext";
import { tiers_details } from "./detail_tier/tiers_details.service";
import { sendSoapRequest } from "./soap.service";

export async function cont_garanti_create(
	basSecurityContext: BasSecurityContext,
	contrat: number,
	adhesion?: number,
	piece?: number, 
	data?: any,
	ctx?: { userId?: string; domain?: string; password?: string }
) {
  //const soapBody = {typtiers,nature,numtiers,numdpp,data}
  const params=new BasParams()
  basSecurityContext ?  params.AddStr("BasSecurityContext",basSecurityContext?.ToSoapVar()) :null
  params.AddInt("contrat",contrat)
  if(adhesion){
	  params.AddInt("adhesion",adhesion)
  }
  if(piece){
	  params.AddInt("piece",piece)
  }
	
	//if (data) {
	//	params.AddStr("data",tierModelToXml(data))	}
  
	const result = await sendSoapRequest(params, "Cont_add_garantis", basSecurityContext, "Garan", data, ctx);
	//const resp= await tiers_details(basec, result.Numtiers, true, true, ctx);
 
    return result;
}