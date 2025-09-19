import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';


export async function Sinistre_ListItemsHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
  params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar());
  params.AddInt("dossier",req.body.dossier);
  params.AddInt("contrat",req.body.contrat);
    const result = await sendSoapRequest(params,"Sinistre_ListItems",basSecurityContext,"sinistres");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
};


export async function Sinistre_DetailHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("sinistre",req.body.sinistre)
     
    const result = await sendSoapRequest(params,"Sinistre_Detail",basSecurityContext, "sinistre");
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
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    req.body.contrat ? params.AddInt("contrat",req.body.contrat) :null
     params.AddInt("dossier",req.body.dossier)
     params.AddString("produit",req.body.produit)
     params.AddString("libelle",req.body.libelle)
    const data = req.body.data
    const result = await sendSoapRequest(params, "Sinistre_Create", basSecurityContext,"Sinistre",data);
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
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
     params.AddString("libelle",req.body.libelle)
    const data = req.body.data
    const result = await sendSoapRequest(params,"Sinistre_update",basSecurityContext,"Sinistre",data);
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });  }
}

