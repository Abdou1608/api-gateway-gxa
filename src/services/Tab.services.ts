import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';

export async function Tab_ListValues(req: Request, res: Response) {
  try {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddString("tabcode",req.body.tabcode)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListValues", basSecurityContext);
  res.json(result);
} catch (error) {
  res.status(500).json({ error: 'SOAP Error', details: error });
}
}

export async function Tab_ListItems(req: Request, res: Response) {
  try {
  const params=new BasParams()
  const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   if(req.body.filtre){
  params.AddString("filtre",req.body.filtre ) }
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_ListItems", basSecurityContext);
  res.json(result);
} catch (error) {
  res.status(500).json({ error: 'SOAP Error', details: error });
}
}

export async function Tab_GetValue(req: Request, res: Response) {
  try {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddString("tabcode",req.body?.tabcode)
   params.AddString("tabref",req.body?.tabref)
   params.AddString("datanode","tabs")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Tab_GetValue", basSecurityContext);
} catch (error) {
  res.status(500).json({ error: 'SOAP Error', details: error });

}
}