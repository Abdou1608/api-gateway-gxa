import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from './soap.service';

export type AuthCtx = { sid: string; userId?: string; domain?: string };

export async function updateTier(body: any, auth: AuthCtx) {
  const ctx = new BasSecurityContext();
  const params = new BasParams();
  const basSecurityContext = new BasSecurityContext();
  basSecurityContext.SessionId = auth.sid;
  basSecurityContext.IsAuthenticated = true as any;
  params.AddStr('BasSecurityContext', basSecurityContext.ToSoapVar());

  // existing SOAP method expects dossier + data
  const dossier = typeof body.dossier === 'string' ? JSON.parse(body.dossier) : body.dossier;
   params.AddInt('dossier', dossier);
  const data = body.data;
  // Some legacy service uses raw soapBody, keep using sendSoapRequest in that shape
  const soapBody = { dossier, data } as any;
  const result = await sendSoapRequest(params, 'Tiers_Update', basSecurityContext, "tiers", data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
  return result;
}
