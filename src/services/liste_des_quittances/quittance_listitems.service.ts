import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function quittance_listitems(dossier:number,
contrat: number,BasSecurityContext:BasSecurityContext,) {
  const params=new BasParams()
params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
 params.AddInt("dossier",dossier)
  params.AddInt("contrat",contrat)
//   disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","quit")
  const result = await sendSoapRequest(params,"Quittance_ListItems",BasSecurityContext);
  return result;
}