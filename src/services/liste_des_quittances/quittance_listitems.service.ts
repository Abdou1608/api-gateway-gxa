import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function quittance_listitems(dossier:number,
contrat: number,BasSecurityContext:BasSecurityContext,) {
  const params=new BasParams()
params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
params.AddInt("contrat",contrat)
 params.AddInt("dossier",dossier)
 
//   disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","quit")
  const result = await sendSoapRequest(params,"Quittance_ListItems",BasSecurityContext);
  return result;
}