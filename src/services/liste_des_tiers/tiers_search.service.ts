import { sendSoapRequest } from '../soap.service';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { Tier } from '../../Model/tier.model';

export async function tiers_search(BasSecurityContext: BasSecurityContext, reference: string, dppname: string, typetiers?: string, ntel?: string, datenais?: string, rsociale?: any) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
  if(reference!="" && reference!=null){params.AddString("reference",reference)}
   if(rsociale!="" && rsociale!=null){params.AddString("rsociale",rsociale)}
   if(dppname!="" && dppname!=null){params.AddString("dppname",dppname)}
   
    const _typetiers = typetiers?? "" 
    const _ntel = ntel?? "" 
    const _datenais = datenais?? ""
    if(_typetiers!=="" && _typetiers!==null){ params.AddString("typetiers","_typetiers") }
   if(_ntel!=="" && _ntel!==null){ params.AddString("ntel",_ntel) }
   if(_datenais!=="" && _datenais!==null) {
    params.AddString("datenais",_datenais)}
   //  params.AddString("typetiers",_typetiers)

   params.AddString("datanode","")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  let result:[Tier] 
   result = await sendSoapRequest(params, "Tiers_Search", BasSecurityContext);
  return result;
}