import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

export async function Tab_ListValues(req: Request, res: Response) {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddString("tabcode",req.body.tabcode)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListValues", basSecurityContext, "tabs", undefined, { userId: (req as any).user?.sub, domain: req.body?.domain });
  const grouped = groupByTypename(result, { keepUnknown: true });
 // return grouped;
  res.json(grouped);
}

export async function Tab_ListItems(req: Request, res: Response) {
  const params=new BasParams()
  const basSecurityContext = new BasSecurityContext()
  basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
  basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   if(req.body.filtre){
  params.AddString("filtre",req.body.filtre ) }
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListItems", basSecurityContext, "tab", undefined, { userId: (req as any).user?.sub, domain: req.body?.domain });
  res.json(result);
}

export async function Tab_GetValue(req: Request, res: Response) {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddString("tabcode",req.body?.tabcode)
   params.AddString("tabref",req.body?.tabref)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_GetValue", basSecurityContext, undefined, undefined, { userId: (req as any).user?.sub, domain: req.body?.domain });
  res.json(result);
}