import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from '../soap.service';


export async function cont_update(dossier:number,
  piece?:string,
  effet?:Date,
  data?: string,BasSecurityContext?:any,) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("dossier",dossier)
    piece ? params.AddString("piece",piece) : null
    effet ? params.AddDateTime("effet",effet) : null
    data ? params.AddStr("data",data) : null

  const result = await sendSoapRequest(params, "Cont_Update",BasSecurityContext);
  return result;
}
export async function cont_piece_update(dossier:number,
  piece:string,
  data?: string,BasSecurityContext?:any,) {
    const params=new BasParams()
    params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
    params.AddInt("dossier",dossier)
 params.AddString("piece",piece)
   // effet ? params.AddDateTime("effet",effet) : null
    data ? params.AddStr("data",data) : null

  const result = await sendSoapRequest(params, "Cont_Updatepiece",BasSecurityContext);
  return result;
}