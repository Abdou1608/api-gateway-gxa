import { BasParams } from '../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import groupByTypename from '../utils/groupByTypename';
import { sendSoapRequest } from './soap.service';

export type AuthCtx = { sid: string; userId?: string; domain?: string };

export async function riskListItems(body: any, auth: AuthCtx) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  if (body.contrat) params.AddInt('contrat', body.contrat);
  if (body.piece) params.AddInt('piece', body.piece);
  params.AddString('datanode', 'risks');
  const result = await sendSoapRequest(params, 'Risk_ListItems', ctx, 'risks', undefined, { userId: auth.userId, domain: auth.domain ?? body?.domain });
  return result;
}

export async function riskCreate(body: any, auth: AuthCtx) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  if (body.contrat) params.AddInt('contrat', body.contrat);
  if (body.piece) params.AddInt('piece', body.piece);
  if (body.dateEntree && typeof body.dateEntree === 'string') {params.AddStrDate('dateEntree', body.dateEntree)}
  else if (body.dateEntree && typeof body.dateEntree !== 'string') {
    params.AddDateTime('dateEntree', body.dateEntree);
  }
  else {
    params.AddDateTime('dateEntree', new Date());
  } 
  params.AddString('datanode', 'Risk');
  const result = await sendSoapRequest(params, 'Risk_Create', ctx, 'risk', body.data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
  return result;
}

export async function riskUpdate(body: any, auth: AuthCtx) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  if (body.contrat) params.AddInt('contrat', body.contrat);
  if (body.piece) params.AddInt('piece', body.piece);
  if (body.adhesion) params.AddInt('adhesion', body.adhesion);
   if (body.dateEntree && typeof body.dateEntree === 'string') {params.AddStrDate('dateEntree', body.dateEntree)}
  else if (body.dateEntree && typeof body.dateEntree !== 'string') {
    params.AddDateTime('dateEntree', body.dateEntree);
  }
  else {
    params.AddDateTime('dateEntree', new Date());
  }   params.AddString('datanode', 'Risk');
  const result = await sendSoapRequest(params, 'Risk_Update', ctx, 'risk', body.data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
 //const grouped = groupByTypename(result, { keepUnknown: true });
  return {result,contrat: body.contrat, piece: body.piece, adhesion: body.adhesion};
}
