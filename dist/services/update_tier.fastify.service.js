"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTier = updateTier;
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const soap_service_1 = require("./soap.service");
async function updateTier(body, auth) {
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    // existing SOAP method expects dossier + data
    const dossier = typeof body.dossier === 'string' ? JSON.parse(body.dossier) : body.dossier;
    const data = body.data;
    // Some legacy service uses raw soapBody, keep using sendSoapRequest in that shape
    const soapBody = { dossier, data };
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, 'Tiers_Update', ctx, undefined, data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
    return result;
}
