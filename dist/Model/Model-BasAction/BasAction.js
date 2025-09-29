"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasAction = void 0;
const Xpath = __importStar(require("xpath"));
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
const pending_queue_1 = require("../../utils/pending-queue");
const metrics_1 = require("../../observability/metrics");
const soap_audit_1 = require("../../observability/soap-audit");
class BasAction {
    constructor(BasSoapCLient, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.appConfigService = appConfigService;
        this.http = require('http');
    }
    async RunAction(actionName, basParams, basSecurityContext, xmldata, ctx) {
        let body = "<ns1:RunAction>" + basSecurityContext.ToSoapVar() + `<name xsi:type=\"xsd:string\">${actionName}</name>`;
        //console.log("Dans RunAction xmldata est :====="+xmldata) 
        basParams.AddStr("data", xmldata ?? "");
        body += basParams.ToSoapVar();
        //body +="<params>"+(xmldata ?? "")+"</params>"
        body += '</ns1:RunAction>';
        console.log("Body de la requete est:=====" + body);
        const p = pending_queue_1.PendingQueue.register(actionName, ctx);
        await soap_audit_1.SoapAudit.init();
        const auditStart = Date.now();
        logger_1.default.info(`[SOAP] ▶ RunAction ${actionName} owner=${ctx?.userId ?? '-'} domain=${ctx?.domain ?? '-'} queue=${pending_queue_1.PendingQueue.size()} [${pending_queue_1.PendingQueue.formatSnapshot()}]`);
        (0, metrics_1.recordQueueSize)(pending_queue_1.PendingQueue.size());
        let response;
        try {
            response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlActionService(), body, ctx);
            const end = Date.now();
            // capture small payload snippet (strip whitespace, truncate)
            const snippet = (response || '').replace(/\s+/g, ' ').slice(0, 800);
            soap_audit_1.SoapAudit.record({ id: p.id, action: actionName, owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: snippet });
        }
        finally {
            const ended = pending_queue_1.PendingQueue.complete(p.id);
            if (ended) {
                const durMs = Date.now() - ended.startedAt;
                const sec = durMs / 1000;
                (0, metrics_1.observeSoapDuration)(actionName, sec);
                (0, metrics_1.observeSoapDurationLabeled)(ctx?.userId, ctx?.domain, sec);
                logger_1.default.info(`[SOAP] ◀ RunAction ${actionName} done in ${durMs}ms owner=${ctx?.userId ?? '-'} domain=${ctx?.domain ?? '-'} queue=${pending_queue_1.PendingQueue.size()} [${pending_queue_1.PendingQueue.formatSnapshot()}]`);
                (0, metrics_1.recordQueueSize)(pending_queue_1.PendingQueue.size());
            }
        }
        // Centralisation fault -> handleSoapResponse (lèvera AppError si fault)
        try {
            response = (0, soap_fault_handler_1.handleSoapResponse)(response, logger_1.default);
        }
        catch (e) {
            // Add audit record for error before rethrowing
            const end = Date.now();
            const errMsg = (e?.message || '').toString();
            const errSnippet = errMsg.slice(0, 800);
            soap_audit_1.SoapAudit.record({ id: p.id, action: actionName, owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: e?.code || e?.name, errorMessage: e?.message, errorSnippet: errSnippet });
            throw e;
        }
        return response;
    }
    GetLogEntry(soapEnv) {
        let result = new Array();
        return result;
    }
    GetDataFromSoapEnv(soapEnv) {
        let XmlParser = new DOMParser();
        let XmlDoc = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect = Xpath.useNamespaces({
            "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
            "lg": "http://belair-info.com/bas/services"
        });
        let val = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasActionResult/Data", XmlDoc);
        if (val[0] !== undefined)
            return String(val[0].textContent);
        return "";
    }
}
exports.BasAction = BasAction;
