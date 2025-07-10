import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';

export async function Tab_ListValues(BasSecurityContext:BasSecurityContext,tabcode:string) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("tabcode",tabcode)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListValues", BasSecurityContext);
  return result;
}

export async function Tab_ListItems(BasSecurityContext:BasSecurityContext,filtre?:string) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   if(filtre){
  params.AddString("filtre",filtre ) }
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListItems", BasSecurityContext);
  return result;
}

export async function Tab_GetValue(BasSecurityContext:BasSecurityContext,tabcode:string,tabref:string) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("tabcode",tabcode)
   params.AddString("tabref",tabref)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_GetValue", BasSecurityContext);
  return result;
}