"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabListValues = tabListValues;
exports.tabListItems = tabListItems;
exports.tabGetValue = tabGetValue;
// Express types removed; keep only Fastify-native helpers
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
// Fastify-native pure-return helpers
async function tabListValues(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddString('tabcode', body.tabcode);
    params.AddString('datanode', 'tabs');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Tab_ListValues', ctx, 'tabs', undefined, { userId: auth.userId, domain: body?.domain });
    return (0, groupByTypename_1.default)(result, { keepUnknown: true });
}
async function tabListItems(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    if (body.filtre)
        params.AddString('filtre', body.filtre);
    params.AddString('datanode', 'tabs');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Tab_ListItems', ctx, 'tab', undefined, { userId: auth.userId, domain: body?.domain });
    return result;
}
async function tabGetValue(body, auth) {
    const params = new BasParams_1.BasParams();
    const ctx = new BasSecurityContext_1.BasSecurityContext();
    ctx.SessionId = auth.sid;
    ctx.IsAuthenticated = true;
    params.AddStr('BasSecurityContext', ctx.ToSoapVar());
    params.AddString('tabcode', body?.tabcode);
    params.AddString('tabref', body?.tabref);
    params.AddString('datanode', 'tabs');
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Tab_GetValue', ctx, undefined, undefined, { userId: auth.userId, domain: body?.domain });
    return result;
}
// Legacy Express-style handlers removed
