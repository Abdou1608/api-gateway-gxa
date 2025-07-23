import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { Tier } from "../../Model/tier.model";
import { sendSoapRequest } from "../soap.service";
import { tierModelToXml } from './tier_to_xml.service';


export async function tiers_create(basec:BasSecurityContext ,typtiers : string,
	nature? : string, 
	numtiers?: number, 
	numdpp?: number,
	data ?: Tier) {
  //const soapBody = {typtiers,nature,numtiers,numdpp,data}
  const params=new BasParams()
    params.AddStr("BasSecurityContext",basec.ToSoapVar())
 
	numtiers ? params.AddInt("numtiers",numtiers) :null
    numdpp ? params.AddInt("numdpp",numdpp) : null
    nature ? params.AddString("nature",nature) : null
	params.AddStr("typtiers",typtiers)
	if (data) {
		params.AddStr("data",tierModelToXml(data))	
	}
  
  const result = await sendSoapRequest(params,"Tiers_Create");
  return result;
}