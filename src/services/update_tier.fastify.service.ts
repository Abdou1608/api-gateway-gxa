import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from './soap.service';

export type AuthCtx = { sid: string; userId?: string; domain?: string };

export async function updateTier(body: any, auth: AuthCtx) {
  const ctx = new BasSecurityContext();
  ctx.IsAuthenticated = true as any;
  ctx.SessionId = auth.sid as any;
  // existing SOAP method expects dossier + data
  const dossier = typeof body.dossier === 'string' ? JSON.parse(body.dossier) : body.dossier;
  const data = body.data;
  // Some legacy service uses raw soapBody, keep using sendSoapRequest in that shape
  const soapBody = { dossier, data } as any;
  const result = await sendSoapRequest(soapBody, 'Tiers_Update', ctx, undefined, data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
  return result;
}
