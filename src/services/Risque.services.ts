import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

export async function Risk_ListItems(req: Request, res: Response) {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   params.AddInt("contrat",req.body.contrat)
   params.AddInt("piece",req.body.piece)
   params.AddString("datanode","risks")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Risk_ListItems", basSecurityContext, "risks", undefined, { userId: (req as any).user?.sub, domain: req.body?.domain });
  res.json(result);
}

export async function Risk_Create(req: Request, res: Response) {
  const params=new BasParams()
  const basSecurityContext = new BasSecurityContext()
  basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
  basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
   if(req.body.contrat){
  params.AddInt("contrat",req.body.contrat ) }
  if(req.body.piece){
    params.AddInt("piece",req.body.piece ) }
    if(req.body.dateEntree && typeof req.body.dateEntree !== 'string'){
      params.AddDateTime("dateEntree",req.body.dateEntree ) }
       else if(req.body.dateEntree && typeof req.body.dateEntree === 'string'){
        params.AddStrDate("dateEntree",req.body.dateEntree ) }
        else {
        params.AddDateTime("dateEntree",new Date() ) }
   params.AddString("datanode","Risk")
 // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Risk_Create", basSecurityContext, "risk", req.body.data, { userId: (req as any).user?.sub, domain: req.body?.domain });
  res.json(result);
}

export async function Risk_Update(req: Request, res: Response) {
  const params=new BasParams()
  //const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
    basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
  if(req.body.contrat){
    params.AddInt("contrat",req.body.contrat ) }
    if(req.body.piece){
      params.AddInt("piece",req.body.piece ) }
      if(req.body.adhesion){
        params.AddInt("adhesion",req.body.adhesion ) }
        
      if(req.body.dateEntree && typeof req.body.dateEntree !== 'string'){
      //  params.AddInt("dateEntree",req.body.dateEntree ) }
        params.AddDateTime("dateEntree",req.body.dateEntree ) }
        else if(req.body.dateEntree && typeof req.body.dateEntree === 'string'){
        params.AddStrDate("dateEntree",req.body.dateEntree ) }
        else {
          params.AddDateTime("dateEntree",new Date() ) }
     params.AddString("datanode","Risk")
   // const soapBody = {reference,dppname,typetiers,codp,datenais}
  const result = await sendSoapRequest(params, "Risk_Update", basSecurityContext, "risk", req.body.data, { userId: (req as any).user?.sub, domain: req.body?.domain });
   // res.json(result);
     const grouped = groupByTypename(result, { keepUnknown: true });
     res.json(grouped)
}