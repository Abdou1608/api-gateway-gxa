import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { contModelToXml } from '../create_contrat/cont_to_xml.service';
import { sendSoapRequest } from '../soap.service';


export async function cont_update(
  contrat: number,
  effet?: string,
  piece?: number,
  data?: any,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("contrat",contrat)
    piece ? params.AddInt("piece",piece) : null
    effet ? params.AddDateTime("effet",new Date(effet)) : null
  // data ? params.AddStr("data",contModelToXml(data)) :null
   //console.log("££££££££===========DATA"+JSON.stringify( data))

  const result = await sendSoapRequest(
    params,
    "Cont_Update",
    BasSecurityContext,
    "cont",
    data,
    ctx
  );
  return result;
}
export async function cont_piece_update(contrat:number,produit:string,
  piece:number,Effet?:any,
  data?: any,BasSecurityContext?:any, ctx?: { userId?: string; domain?: string; password?: string }) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("contrat",Number(contrat))
    if(piece){ params.AddInt("piece",Number(piece))}

 params.AddString("produit",produit)
 if(Effet){params.AddDateTime("Effet",Effet )}
 
   // effet ? params.AddDateTime("effet",effet) : null
   //data ? params.AddString("data",data) : null

  const result = await sendSoapRequest(
    params,
    "Cont_Updatepiece",
    BasSecurityContext,
    "piec",
    data,
    ctx
  );
  return result;
}