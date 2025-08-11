import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { contModelToXml } from '../create_contrat/cont_to_xml.service';
import { sendSoapRequest } from '../soap.service';


export async function cont_update(contrat:number,piece?:number,
  data?: any,BasSecurityContext?:any,) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("contrat",contrat)
    piece ? params.AddInt("piece",piece) : null
   // effet ? params.AddDateTime("effet",effet) : null
  // data ? params.AddStr("data",contModelToXml(data)) :null
   //console.log("££££££££===========DATA"+JSON.stringify( data))

  const result = await sendSoapRequest(params, "Cont_Update",BasSecurityContext,"",data );
  return result;
}
export async function cont_piece_update(contrat:number,produit:string,
  piece:number,Effet?:any,
  data?: any,BasSecurityContext?:any,) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("contrat",contrat)
    if(piece){ params.AddInt("piece",piece)}

 params.AddString("produit",produit)
 if(Effet){params.AddDateTime("Effet",Effet )}
 
   // effet ? params.AddDateTime("effet",effet) : null
   data ? params.AddString("data",data) : null

  const result = await sendSoapRequest(params, "Cont_Updatepiece",BasSecurityContext, "piec",data);
  return result;
}