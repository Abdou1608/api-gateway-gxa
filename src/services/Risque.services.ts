import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';

export async function Risk_ListItems(req: Request, res: Response) {
  try {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddInt("contrat",req.body.contrat)
   params.AddInt("piece",req.body.piece)
   params.AddString("datanode","risks")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Risk_ListItems", basSecurityContext,"risks");
  res.json(result);
} catch (error:any) {
  const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
}
}

export async function Risk_Create(req: Request, res: Response) {
  try {
  const params=new BasParams()
  const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   if(req.body.contrat){
  params.AddInt("contrat",req.body.contrat ) }
  if(req.body.piece){
    params.AddInt("piece",req.body.piece ) }
    if(req.body.dateEntree){
      params.AddDateTime("dateEntree",req.body.dateEntree ) }
   params.AddString("datanode","Risk")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Risk_Create", basSecurityContext,"risk", req.body.data);
  res.json(result);
} catch (error:any) {
  const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
}
}

export async function Risk_Update(req: Request, res: Response) {
  try {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
  if(req.body.contrat){
    params.AddInt("contrat",req.body.contrat ) }
    if(req.body.piece){
      params.AddInt("piece",req.body.piece ) }
      if(req.body.dateEntree){
        params.AddInt("dateEntree",req.body.dateEntree ) }
     params.AddString("datanode","Risk")
   // const soapBody = {reference,dppname,typetiers,codp,datenais}
    const result = await sendSoapRequest(params, "Risk_Update", basSecurityContext,"risk", req.body.data);
    res.json(result);
  } catch (error:any) {
  const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });

}
}