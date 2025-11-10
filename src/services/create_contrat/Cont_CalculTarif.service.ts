import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { ContModel } from '../../Model/create_update_contrat';
import groupByTypename from '../../utils/groupByTypename';
import { cont_details } from '../detail_contrat/cont_details.service';
import { AuthCtx } from '../risk.service';
import { sendSoapRequest } from '../soap.service';
import { contModelToXml } from './cont_to_xml.service';


export async function Cont_CalculTarif(
  contrat: number,
  piece: number,
  adhesion: number,
 auth: AuthCtx
) {
   const params = new BasParams();
     const ctx = new BasSecurityContext();
     ctx.IsAuthenticated = true as any;
     ctx.SessionId = auth.sid as any;
     params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt("contrat",contrat)
    piece ? params.AddInt("piece",piece) : null
    adhesion ? params.AddInt("adhesion",adhesion) : null
    params.AddBool("details",true)

 // data ? params.AddStr("data",contModelToXml(data)) :null
  //console.log("££££££££===========DATA"+JSON.stringify( data))
  const result = await sendSoapRequest(
    params,
    "Cont_CalculTarif",
    ctx,
    "calcultarif",
    null
  );
  console.log("$$$$$$$$$ RESULT CREATE CONTRAT "+JSON.stringify(result))
    return result
  
}