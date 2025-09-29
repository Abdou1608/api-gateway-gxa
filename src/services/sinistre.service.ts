// Express types removed; Fastify-native pure-return helpers only
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

// Fastify-native pure-return helpers
export async function sinistreListItems(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  const dossierId = typeof body.dossier === 'string' ? Number(body.dossier) : body.dossier;
  if (dossierId && dossierId > 0) params.AddInt('dossier', dossierId);
  const contraId = typeof body.contrat === 'string' ? Number(body.contrat) : body.contrat;
  if (contraId && contraId > 0) params.AddInt('contrat', contraId);
  const result = await sendSoapRequest(params, 'Sin_Listitems', ctx, 'sins', undefined, { userId: auth.userId, domain: body?.domain });
  return groupByTypename(result, { keepUnknown: true });
}

export async function sinistreDetail(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  const sinistre = body.sinistre ?? 0;
  if (sinistre && sinistre > 0) params.AddInt('sinistre', sinistre);
  const result = await sendSoapRequest(params, 'Sin_Details', ctx, 'sin', undefined, { userId: auth.userId, domain: body?.domain });
  return groupByTypename(result, { keepUnknown: true });
}

export async function sinistreCreate(body: any, auth: { sid: string; userId?: string; domain?: string }) {
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
  const result = await sendSoapRequest(params, 'Sin_Create', ctx, 'Sinistre', data, { userId: auth.userId, domain: body?.domain });
  return result;
}

export async function sinistreUpdate(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddInt('idproj', body.idproj);
  params.AddString('libelle', body.libelle);
  const data = body.data;
  const result = await sendSoapRequest(params, 'Sin_update', ctx, 'Sinistre', data, { userId: auth.userId, domain: body?.domain });
  return result;
}



// Legacy Express-style handlers removed (now replaced by Fastify-native helpers)

