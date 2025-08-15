import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';


export async function Project_ListItemsHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("dossier",req.body.dossier)
    const result = await sendSoapRequest(params,"Project_ListItems",basSecurityContext,"projects");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
};

export async function Project_OfferListItemsHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
    // params.AddInt("projet",req.body.projet)
    const result = await sendSoapRequest(params,"Project_OfferListItem",basSecurityContext,"offers");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_DetailHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
     
    const result = await sendSoapRequest(params,"Project_Detail",basSecurityContext, "project");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_CreateHandler(req: Request, res: Response) {
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
    const result = await sendSoapRequest(params, "Project_Create", basSecurityContext,"offers",data);
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_updateHandler(req: Request, res: Response) {
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
    const result = await sendSoapRequest(params,"Project_update",basSecurityContext,"project",data);
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_AddOfferHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    // params.AddInt("dossier",req.body.dossier)
     params.AddString("produit",req.body.produit)
    // params.AddString("libelle",req.body.libelle)
    const result = await sendSoapRequest(params, "Project_AddOffer",basSecurityContext,"offer");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_DeleteOfferHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    params.AddInt("idoffer",req.body.idoffer)
   //  params.AddString("produit",req.body.produit)
    const result = await sendSoapRequest(params,"Project_DeleteOffer",basSecurityContext, "project");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}

export async function Project_ValidateOfferHandler(req: Request, res: Response) {
  try {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.body?.BasSecurityContext._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    params.AddInt("idoffer",req.body.idoffer)
    params.AddString("defaut",req.body.defaut)
    params.AddBool("Avenant",req.body.Avenant)
    const result = await sendSoapRequest(params,"Project_ValidateOffer",basSecurityContext, "Cont");
    res.json(result);
  } catch (error:any) {
     const e=error ? error :null
  res.status(500).json({ error: 'SOAP Error:'+e?.message, details: e });
  }
}
