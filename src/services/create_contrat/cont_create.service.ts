import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { ContModel } from '../../Model/create_update_contrat';
import { sendSoapRequest } from '../soap.service';
import { contModelToXml } from './cont_to_xml.service';


export async function cont_create(dossier:number,
  produit?:string,
  effet?:Date,
  data?: any,BasSecurityContext?:any ) {
    const params=new BasParams()
    BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
    params.AddInt("dossier",dossier)
    produit ? params.AddString("produit",produit) : null
    effet ? params.AddDateTime("effet",effet) : null
 // data ? params.AddStr("data",contModelToXml(data)) :null
  //console.log("££££££££===========DATA"+JSON.stringify( data))
  const result = await sendSoapRequest(params, "Cont_Create", BasSecurityContext,"",data);
  return result;
}