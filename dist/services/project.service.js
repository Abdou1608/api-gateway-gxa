"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectListItems = projectListItems;
exports.projectOfferListItems = projectOfferListItems;
exports.projectDetail = projectDetail;
exports.projectCreate = projectCreate;
exports.projectUpdate = projectUpdate;
exports.projectAddOffer = projectAddOffer;
exports.projectDeleteOffer = projectDeleteOffer;
exports.projectValidateOffer = projectValidateOffer;
// Express types removed; only Fastify-native helpers remain
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
// Fastify-native service wrappers returning data instead of writing to res
async function projectListItems(body, auth) {
    const params = new BasParams_1.BasParams();
    const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    basSecurityContext.SessionId = auth.sid;
    basSecurityContext.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', basSecurityContext.ToSoapVar());
    params.AddInt('dossier', body.dossier);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_ListItems', basSecurityContext, 'projects', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return result;
}
async function projectOfferListItems(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_OfferListItem', ctx, 'Project', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    let project = result?.project;
    // let offers =  groupByTypename(project?.offers, { keepUnknown: true }); 
    const offers = normalizeOffers((0, groupByTypename_1.default)(project?.offers, { keepUnknown: true }));
    project.offers = offers;
    return (0, groupByTypename_1.default)(project, { keepUnknown: true });
    //return project;
}
const normalizeOffers = (offers) => {
    if (Array.isArray(offers)) {
        return offers;
    }
    if (offers && typeof offers === 'object') {
        return Object.values(offers);
    }
    return [];
};
async function projectDetail(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_Detail', ctx, 'project', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return (0, groupByTypename_1.default)(result, { keepUnknown: true });
}
async function projectCreate(body, auth) {
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
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_Create', ctx, 'Project', data, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return result;
}
async function projectUpdate(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    params.AddString('libelle', body.libelle);
    const data = body.data;
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_update', ctx, 'project', data, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return result;
}
async function projectAddOffer(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddInt('idproj', body.idproj);
    params.AddString('produit', body.produit);
    return (0, soap_service_1.sendSoapRequest)(params, 'Project_AddOffer', ctx, 'offer', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
}
async function projectDeleteOffer(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    params.AddInt('idoffer', body.idoffer);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_DeleteOffer', ctx, 'project', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return result;
}
async function projectValidateOffer(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddInt('idproj', body.idproj);
    params.AddInt('idoffer', body.idoffer);
    params.AddString('defaut', body.defaut);
    params.AddBool('Avenant', body.Avenant);
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Project_ValidateOffer', ctx, 'Cont', undefined, { userId: auth.userId ?? auth.sid, domain: body?.domain });
    return result;
}
// Legacy Express-style project handlers removed
