import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';


export async function Project_ListItemsHandler(req: Request, res: Response) {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId

      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("dossier",req.body.dossier)
    const result = await sendSoapRequest(
      params,
      "Project_ListItems",
      basSecurityContext,
      "projects",
      undefined,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    res.json(result);
};

export async function Project_OfferListItemsHandler(req: Request, res: Response) {
  let params=new BasParams()
    //const params = req.body;
    let _BasSecurityContext= new BasSecurityContext()
    _BasSecurityContext.IsAuthenticated=true
    _BasSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
   params.AddStr("BasSecurityContext",_BasSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
    // params.AddInt("projet",req.body.projet)
    const result = await sendSoapRequest(
      params,
      "Project_OfferListItem",
      _BasSecurityContext,
      "Project",
      undefined,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    const grouped = groupByTypename(result, { keepUnknown: true });

    res.json(grouped);
}

export async function Project_DetailHandler(req: Request, res: Response) {
   let params=new BasParams()
    //const params = req.body;
      let basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
     
    const result = await sendSoapRequest(
      params,
      "Project_Detail",
      basSecurityContext,
      "project",
      undefined,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    const grouped = groupByTypename(result, { keepUnknown: true });

    res.json(grouped);
}

export async function Project_CreateHandler(req: Request, res: Response) {
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
    const result = await sendSoapRequest(
      params,
      "Project_Create",
      basSecurityContext,
      "Project",
      data,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    res.json(result);
}

export async function Project_updateHandler(req: Request, res: Response) {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
     params.AddInt("idproj",req.body.idproj)
     params.AddString("libelle",req.body.libelle)
    const data = req.body.data
    const result = await sendSoapRequest(
      params,
      "Project_update",
      basSecurityContext,
      "project",
      data,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    res.json(result);
}

export async function Project_AddOfferHandler(req: Request, res: Response) {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    // params.AddInt("dossier",req.body.dossier)
     params.AddString("produit",req.body.produit)
    // params.AddString("libelle",req.body.libelle)
    const result = await sendSoapRequest(
      params,
      "Project_AddOffer",
      basSecurityContext,
      "offer",
      undefined,
  { userId: req.auth?.sid, domain: req.body?.domain }
    );
    res.json(result);
}

export async function Project_DeleteOfferHandler(req: Request, res: Response) {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    params.AddInt("idoffer",req.body.idoffer)
   //  params.AddString("produit",req.body.produit)
    const result = await sendSoapRequest(
      params,
      "Project_DeleteOffer",
      basSecurityContext,
      "project",
      undefined,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}

export async function Project_ValidateOfferHandler(req: Request, res: Response) {
    const params=new BasParams()
    //const params = req.body;
      const basSecurityContext = new BasSecurityContext()
      basSecurityContext.SessionId=req.auth?.sid ?? req.body.BasSecurityContext?._SessionId
      basSecurityContext.IsAuthenticated=true
    params.AddStr("BasSecurityContext",basSecurityContext.ToSoapVar())
    params.AddInt("idproj",req.body.idproj)
    params.AddInt("idoffer",req.body.idoffer)
    params.AddString("defaut",req.body.defaut)
    params.AddBool("Avenant",req.body.Avenant)
    const result = await sendSoapRequest(
      params,
      "Project_ValidateOffer",
      basSecurityContext,
      "Cont",
      undefined,
      { userId: (req as any).user?.sub, domain: req.body?.domain }
    );
    res.json(result);
}
