import { sendSoapRequest } from '../soap.service';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../../Model/BasSoapObject/BasParams';
import groupByTypename from '../../utils/groupByTypename';

export async function tiers_details( BasSecurityContext:BasSecurityContext,Dossier:number, composition?:boolean, 
extensions?:boolean) {
 // const soapBody = {BasSecurityContext:BasSec.ToSoapVar(),Dossier,composition,extensions}
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddInt("Dossier",Dossier)
  // params.AddBool("composition",composition ?? false) 
  params.AddBool("composition",true)
   params.AddBool("extensions",extensions ?? false) 
   params.AddString("ListeEntites","CLI, SAL,DPP")
   params.AddString("datanode","Tiers")
//console.log("BasSecurityContext in tiers_detail service ===="+JSON.stringify( BasSecurityContext))
  const result = await sendSoapRequest(params, "Tiers_Details",BasSecurityContext,"Tiers");
  const grouped = groupByTypename(result, { keepUnknown: true });
  return grouped;
}