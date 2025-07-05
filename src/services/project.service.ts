import { Request, Response } from 'express';
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';


export async function Project_ListItemsHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_ListItems",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
};

export async function Project_OfferListItemsHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_OfferListItems",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_DetailHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_Detail",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_CreateHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params, "Project_Create", basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_updateHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_update",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_AddOfferHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params, "Project_AddOffer",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_DeleteOfferHandler(req: Request, res: Response) {
  try {
    const params = req.body;
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_DeleteOffer",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}

export async function Project_ValidateOfferHandler(req: Request, res: Response) {
  try {
    const params = req.body
    const basSecurityContext = new BasSecurityContext()
    basSecurityContext.SessionId=req.body.BasSecurityContext._SessionId
    basSecurityContext.IsAuthenticated=true
    const result = await sendSoapRequest(params,"Project_ValidateOffer",basSecurityContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'SOAP Error', details: error });
  }
}
