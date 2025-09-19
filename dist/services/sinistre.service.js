"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinistre_ListItemsHandler = Sinistre_ListItemsHandler;
exports.Sinistre_DetailHandler = Sinistre_DetailHandler;
exports.Sinistre_CreateHandler = Sinistre_CreateHandler;
exports.Sinistre_updateHandler = Sinistre_updateHandler;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const BasParams_1 = require("../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
async function Sinistre_ListItemsHandler(req, res) {
    try {
        const params = new BasParams_1.BasParams();
        //const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body?.BasSecurityContext._SessionId;
        basSecurityContext.IsAuthenticated = true;
        params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
        params.AddInt("dossier", req.body.dossier);
        params.AddInt("contrat", req.body.contrat);
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Sinistre_ListItems", basSecurityContext, "sinistres");
        res.json(result);
    }
    catch (error) {
        const e = error ? error : null;
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
}
;
async function Sinistre_DetailHandler(req, res) {
    try {
        const params = new BasParams_1.BasParams();
        //const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body?.BasSecurityContext._SessionId;
        basSecurityContext.IsAuthenticated = true;
        params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
        params.AddInt("sinistre", req.body.sinistre);
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Sinistre_Detail", basSecurityContext, "sinistre");
        const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
        res.json(grouped);
    }
    catch (error) {
        const e = error ? error : null;
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
}
async function Sinistre_CreateHandler(req, res) {
    try {
        const params = new BasParams_1.BasParams();
        //const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body?.BasSecurityContext._SessionId;
        basSecurityContext.IsAuthenticated = true;
        params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
        req.body.contrat ? params.AddInt("contrat", req.body.contrat) : null;
        params.AddInt("dossier", req.body.dossier);
        params.AddString("produit", req.body.produit);
        params.AddString("libelle", req.body.libelle);
        const data = req.body.data;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Sinistre_Create", basSecurityContext, "Sinistre", data);
        res.json(result);
    }
    catch (error) {
        const e = error ? error : null;
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
}
async function Sinistre_updateHandler(req, res) {
    try {
        const params = new BasParams_1.BasParams();
        //const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body?.BasSecurityContext._SessionId;
        basSecurityContext.IsAuthenticated = true;
        params.AddStr("BasSecurityContext", basSecurityContext.ToSoapVar());
        params.AddInt("idproj", req.body.idproj);
        params.AddString("libelle", req.body.libelle);
        const data = req.body.data;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Sinistre_update", basSecurityContext, "Sinistre", data);
        res.json(result);
    }
    catch (error) {
        const e = error ? error : null;
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
}
