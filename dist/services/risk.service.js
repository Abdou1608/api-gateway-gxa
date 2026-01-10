"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskListItems = riskListItems;
exports.riskCreate = riskCreate;
exports.riskUpdate = riskUpdate;
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const soap_service_1 = require("./soap.service");
async function riskListItems(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.contrat)
        params.AddInt('contrat', body.contrat);
    if (body.piece)
        params.AddInt('piece', body.piece);
    params.AddString('datanode', 'risks');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Risk_ListItems', ctx, 'risks', undefined, { userId: auth.userId, domain: auth.domain ?? body?.domain });
    return result;
}
async function riskCreate(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.contrat)
        params.AddInt('contrat', body.contrat);
    if (body.piece)
        params.AddInt('piece', body.piece);
    if (body.dateEntree && typeof body.dateEntree === 'string') {
        params.AddStrDate('dateEntree', body.dateEntree);
    }
    else if (body.dateEntree && typeof body.dateEntree !== 'string') {
        params.AddDateTime('dateEntree', body.dateEntree);
    }
    else {
        params.AddDateTime('dateEntree', new Date());
    }
    params.AddString('datanode', 'Risk');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Risk_Create', ctx, 'risk', body.data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
    return result;
}
async function riskUpdate(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.IsAuthenticated = true;
    ctx.SessionId = auth.sid;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.contrat || body.Contrat)
        params.AddInt('contrat', body.contrat ?? body.Contrat);
    if (body.piece || body.Piece)
        params.AddInt('piece', body.piece ?? body.Piece);
    if (body.adhesion || body.Adhesion)
        params.AddInt('adhesion', body.adhesion ?? body.Adhesion);
    if (body.dateEntree && typeof body.dateEntree === 'string') {
        params.AddStrDate('dateEntree', body.dateEntree);
    }
    else if (body.dateEntree && typeof body.dateEntree !== 'string') {
        params.AddDateTime('dateEntree', body.dateEntree);
    }
    else {
        params.AddDateTime('dateEntree', new Date());
    }
    params.AddString('datanode', 'Risk');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Risk_Update', ctx, 'risk', body.data, { userId: auth.userId, domain: auth.domain ?? body?.domain });
    //const grouped = groupByTypename(result, { keepUnknown: true });
    return { result, contrat: body.contrat, piece: body.piece, adhesion: body.adhesion };
}
