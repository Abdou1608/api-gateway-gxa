import { sendSoapRequest } from '../soap.service';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../../Model/BasSoapObject/BasParams';

export async function tiers_search(BasSecurityContext:BasSecurityContext,reference: string,
dppname:string, typetiers? : string,codp ?: string, datenais?: string) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("reference",reference)
   params.AddString("dppname",dppname)
    const _typetiers = typetiers?? "" 
     params.AddString("typetiers",_typetiers)

   params.AddString("datanode","")
  const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tiers_Search", BasSecurityContext);
  return result;
}