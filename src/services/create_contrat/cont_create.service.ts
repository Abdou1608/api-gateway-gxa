import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from '../soap.service';


export async function cont_create(dossier:number,
  produit?:string,
  effet?:Date,
  data?: string,BasSecurityContext?:any, ) {
    const params=new BasParams()
    BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
    params.AddInt("dossier",dossier)
    produit ? params.AddString("produit",produit) : null
    effet ? params.AddDateTime("effet",effet) : null
    data ? params.AddStr("data",data) : null

  const result = await sendSoapRequest(params, "Cont_Create", BasSecurityContext);
  return result;
}