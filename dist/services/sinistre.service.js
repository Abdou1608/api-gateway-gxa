"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sinistreListItems = sinistreListItems;
exports.sinistreDetail = sinistreDetail;
exports.sinistreCreate = sinistreCreate;
exports.sinistreUpdate = sinistreUpdate;
// Express types removed; Fastify-native pure-return helpers only
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
// Fastify-native pure-return helpers
async function sinistreListItems(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.dossier) {
        const dossierId = typeof body.dossier === 'string' ? Number(body.dossier) : body.dossier;
        if (dossierId && dossierId > 0)
            params.AddInt('dossier', dossierId);
    }
    if (body.contrat) {
        const contraId = typeof body.contrat === 'string' ? Number(body.contrat) : body.contrat;
        if (contraId && contraId > 0)
            params.AddInt('contrat', contraId);
    }
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Sin_Listitems', ctx, 'sins', null, { userId: auth.userId, domain: body?.domain });
    console.log("!!!!result sinistreListItems:", result);
    return (0, groupByTypename_1.default)(result, { keepUnknown: false });
}
async function sinistreDetail(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    const sinistre = body.sinistre ?? 0;
    if (sinistre && sinistre > 0)
        params.AddInt('sinistre', sinistre);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Sin_Details', ctx, 'sin', undefined, { userId: auth.userId, domain: body?.domain });
    return (0, groupByTypename_1.default)(result, { keepUnknown: true });
}
async function sinistreCreate(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.contrat)
        params.AddInt('contrat', body.contrat);
    params.AddInt('dossier', body.dossier);
    params.AddString('produit', body.produit);
    params.AddString('libelle', body.libelle);
    const data = body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Sin_Create', ctx, 'Sinistre', data, { userId: auth.userId, domain: body?.domain });
    return result;
}
async function sinistreUpdate(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    params.AddString('libelle', body.libelle);
    const data = body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Sin_update', ctx, 'Sinistre', data, { userId: auth.userId, domain: body?.domain });
    return result;
}
// Legacy Express-style handlers removed (now replaced by Fastify-native helpers)
