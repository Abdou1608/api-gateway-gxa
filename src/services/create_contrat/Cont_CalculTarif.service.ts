import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { ContModel } from '../../Model/create_update_contrat';
import groupByTypename from '../../utils/groupByTypename';
import { cont_details } from '../detail_contrat/cont_details.service';
import { sendSoapRequest } from '../soap.service';
import { contModelToXml } from './cont_to_xml.service';


export async function Cont_CalculTarif(
  contrat: number,
  piece?: number,
  adhesion?: number,
  details?: boolean,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
    const params=new BasParams()
    BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
    params.AddInt("contrat",contrat)
    piece ? params.AddInt("piece",piece) : null
    adhesion ? params.AddInt("adhesion",adhesion) : null
    params.AddBool("details",true)

 // data ? params.AddStr("data",contModelToXml(data)) :null
  //console.log("££££££££===========DATA"+JSON.stringify( data))
  const result = await sendSoapRequest(
    params,
    "Cont_CalculTarif",
    BasSecurityContext,
    "calcultarif",
    null
  );
  console.log("$$$$$$$$$ RESULT CREATE CONTRAT "+JSON.stringify(result))
    return result
  
}