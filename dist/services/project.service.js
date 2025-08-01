"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project_ListItemsHandler = Project_ListItemsHandler;
exports.Project_OfferListItemsHandler = Project_OfferListItemsHandler;
exports.Project_DetailHandler = Project_DetailHandler;
exports.Project_CreateHandler = Project_CreateHandler;
exports.Project_updateHandler = Project_updateHandler;
exports.Project_AddOfferHandler = Project_AddOfferHandler;
exports.Project_DeleteOfferHandler = Project_DeleteOfferHandler;
exports.Project_ValidateOfferHandler = Project_ValidateOfferHandler;
const soap_service_1 = require("./soap.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
async function Project_ListItemsHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_ListItems", basSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
;
async function Project_OfferListItemsHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_OfferListItems", basSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_DetailHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_Detail", basSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_CreateHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const data = req.body.data;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_Create", basSecurityContext, data);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_updateHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const data = req.body.data;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_update", basSecurityContext, data);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_AddOfferHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const data = req.body.data;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_AddOffer", basSecurityContext, data);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_DeleteOfferHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_DeleteOffer", basSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
async function Project_ValidateOfferHandler(req, res) {
    try {
        const params = req.body;
        const basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        basSecurityContext.IsAuthenticated = true;
        const result = await (0, soap_service_1.sendSoapRequest)(params, "Project_ValidateOffer", basSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP Error', details: error });
    }
}
