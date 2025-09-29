// Express types removed; keep only Fastify-native helpers
import { sendSoapRequest } from './soap.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import groupByTypename from '../utils/groupByTypename';

// Fastify-native pure-return helpers
export async function tabListValues(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddString('tabcode', body.tabcode);
  params.AddString('datanode', 'tabs');
  const result = await sendSoapRequest(params, 'Tab_ListValues', ctx, 'tabs', undefined, { userId: auth.userId, domain: body?.domain });
  return groupByTypename(result, { keepUnknown: true });
}

export async function tabListItems(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  if (body.filtre) params.AddString('filtre', body.filtre);
  params.AddString('datanode', 'tabs');
  const result = await sendSoapRequest(params, 'Tab_ListItems', ctx, 'tab', undefined, { userId: auth.userId, domain: body?.domain });
  return result;
}

export async function tabGetValue(body: any, auth: { sid: string; userId?: string; domain?: string }) {
  const params = new BasParams();
  const ctx = new BasSecurityContext();
  ctx.SessionId = auth.sid;
  ctx.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', ctx.ToSoapVar());
  params.AddString('tabcode', body?.tabcode);
  params.AddString('tabref', body?.tabref);
  params.AddString('datanode', 'tabs');
  const result = await sendSoapRequest(params, 'Tab_GetValue', ctx, undefined, undefined, { userId: auth.userId, domain: body?.domain });
  return result;
}

// Legacy Express-style handlers removed