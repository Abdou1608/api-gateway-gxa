import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';

export async function quittance_listitems(dossier:any,
contrat: any,BasSecurityContext:BasSecurityContext,) {
  const params=new BasParams()
params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
if (contrat){
  const contratId = typeof contrat === 'string' ? Number(contrat) : contrat;
params.AddInt("contrat",contratId)}
if(dossier){
  const dossierId = typeof dossier === 'string' ? Number(dossier) : dossier;
 params.AddInt("dossier",dossierId)}
 
//   disponible ?  params.AddBool("disponible",disponible) :null

   params.AddString("datanode","quit")
  const result = await sendSoapRequest(params,"Quittance_ListItems",BasSecurityContext);
  return result;
}