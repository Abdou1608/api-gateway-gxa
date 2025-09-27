import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';



export async function Sinistre_ListItemsHandler(req: Request, res: Response) {
  try {
   let params=new BasParams()
    //const params = req.body;
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
  params.AddStr("BasSecurityContext",_BasSecurityContext.ToSoapVar());
  const dossierId = typeof req.body.dossier === 'string' ? Number(req.body.dossier) : req.body.dossier;
  
  if(dossierId && dossierId>0){
  params.AddInt("dossier",dossierId);}
 
  const contraId = typeof req.body.contrat === 'string' ? Number(req.body.contrat) : req.body.contrat;
  const contrat = contraId;
  if(contrat && contrat>0){params.AddInt("contrat",req.body.contrat)}
  ;
    const result = await sendSoapRequest(params,"Sin_Listitems",_BasSecurityContext,"sins");
   const grouped = groupByTypename(result, { keepUnknown: true });
    res.json(grouped);
  } catch (error:any) {
     
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
};


export async function Sinistre_DetailHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    const sinistre= req.body.sinistre ?? 0
    if(sinistre && sinistre>0){
     params.AddInt("sinistre",req.body.sinistre)}
     
    const result = await sendSoapRequest(params,"Sin_Details",basSecurityContext, "sin");
    const grouped = groupByTypename(result, { keepUnknown: true });

    res.json(grouped);
  } catch (error:any) {
     const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
}

export async function Sinistre_CreateHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    req.body.contrat ? params.AddInt("contrat",req.body.contrat) :null
     params.AddInt("dossier",req.body.dossier)
     params.AddString("produit",req.body.produit)
     params.AddString("libelle",req.body.libelle)
    const data = req.body.data
    const result = await sendSoapRequest(params, "Sin_Create", basSecurityContext,"Sinistre",data);
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
}

export async function Sinistre_updateHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
     params.AddString("libelle",req.body.libelle)
    const data = req.body.data
    const result = await sendSoapRequest(params,"Sin_update",basSecurityContext,"Sinistre",data);
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
}

