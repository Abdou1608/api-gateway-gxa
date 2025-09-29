import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { ContModel } from '../../Model/create_update_contrat';
import { sendSoapRequest } from '../soap.service';
import { contModelToXml } from './cont_to_xml.service';


export async function cont_create(
  dossier: number,
  produit?: string,
  effet?: string,
  data?: any,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
    const params=new BasParams()
    BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
    params.AddInt("dossier",dossier)
    produit ? params.AddString("produit",produit) : null
    effet ? params.AddStrDate("effet",effet) : null

 // data ? params.AddStr("data",contModelToXml(data)) :null
  //console.log("££££££££===========DATA"+JSON.stringify( data))
  const result = await sendSoapRequest(
    params,
    "Cont_Create",
    BasSecurityContext,
    "cont",
    data,
    ctx
  );
  return result;
}