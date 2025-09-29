// Express types removed; only Fastify-native helpers remain
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

// Fastify-native service wrappers returning data instead of writing to res
export async function projectListItems(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const basSecurityContext = new BasSecurityContext();
  basSecurityContext.SessionId = auth.sid;
  basSecurityContext.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', basSecurityContext.ToSoapVar());
  params.AddInt('dossier', body.dossier);
  const result = await sendSoapRequest(
    params,
    'Project_ListItems',
    basSecurityContext,
    'projects',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}

export async function projectOfferListItems(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  const result = await sendSoapRequest(
    params,
    'Project_OfferListItem',
    ctx,
    'Project',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return groupByTypename(result, { keepUnknown: true });
}

export async function projectDetail(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  const result = await sendSoapRequest(
    params,
    'Project_Detail',
    ctx,
    'project',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return groupByTypename(result, { keepUnknown: true });
}

export async function projectCreate(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  if (body.contrat) params.AddInt('contrat', body.contrat);
  params.AddInt('dossier', body.dossier);
  params.AddString('produit', body.produit);
  params.AddString('libelle', body.libelle);
  const data = body.data;
  const result = await sendSoapRequest(
    params,
    'Project_Create',
    ctx,
    'Project',
    data,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}

export async function projectUpdate(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  params.AddString('libelle', body.libelle);
  const data = body.data;
  const result = await sendSoapRequest(
    params,
    'Project_update',
    ctx,
    'project',
    data,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}

export async function projectAddOffer(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  params.AddString('produit', body.produit);
  const result = await sendSoapRequest(
    params,
    'Project_AddOffer',
    ctx,
    'offer',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}

export async function projectDeleteOffer(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  params.AddInt('idoffer', body.idoffer);
  const result = await sendSoapRequest(
    params,
    'Project_DeleteOffer',
    ctx,
    'project',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}

export async function projectValidateOffer(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  params.AddInt('idoffer', body.idoffer);
  params.AddString('defaut', body.defaut);
  params.AddBool('Avenant', body.Avenant);
  const result = await sendSoapRequest(
    params,
    'Project_ValidateOffer',
    ctx,
    'Cont',
    undefined,
    { userId: auth.userId ?? auth.sid, domain: body?.domain }
  );
  return result;
}


// Legacy Express-style project handlers removed
