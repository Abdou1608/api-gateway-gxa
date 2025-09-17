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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasSoapFault = void 0;
const Xpath = __importStar(require("xpath"));
const xmldom_1 = require("@xmldom/xmldom");
/** Utilitaire: décodage minimal des entités les plus courantes. */
function decodeXmlEntities(input) {
    return input
        .replace(/^\s+|\s+$/g, '')
        .replace(/^"|"$/g, '') // enlève guillemets englobants éventuels
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");
}
/** Extraction manuelle via RegExp quand XPath échoue (XML cassé ou partiel). */
function regexExtract(tag, xml) {
    const r = new RegExp(`<([A-Za-z0-9_-]+:)?${tag}[^>]*>([\s\S]*?)<\\/([A-Za-z0-9_-]+:)?${tag}>`, 'i');
    const m = r.exec(xml);
    if (m && m[2])
        return m[2].trim();
    return undefined;
}
class BasSoapFault {
    /**
     * Lance toujours une erreur enrichie si le XML représente une faute SOAP.
     */
    static ThrowError(soapEnv) {
        const cleaned = decodeXmlEntities(soapEnv || '');
        if (this.IsBasError(cleaned)) {
            const fault = this.ParseBasErrorDetailed(cleaned);
            throw new Error(fault.shortMessage);
        }
        throw new Error(cleaned);
    }
    /**
     * Détermine si le contenu ressemble à une faute SOAP (robuste: XPath + regex fallback).
     */
    static IsBasError(soapEnv) {
        if (!soapEnv)
            return false;
        const xml = decodeXmlEntities(soapEnv);
        // Heuristique rapide regex
        if (/<([A-Za-z0-9\-_]+:)?Fault\b/i.test(xml))
            return true;
        try {
            const doc = new xmldom_1.DOMParser().parseFromString(xml, 'text/xml');
            const faultNodes = Xpath.select('//*[local-name()="Envelope"]/*[local-name()="Body"]/*[local-name()="Fault"]', doc);
            if (faultNodes?.length)
                return true;
            const indicators = Xpath.select('//*[local-name()="faultcode"]', doc).length +
                Xpath.select('//*[local-name()="faultstring"]', doc).length +
                Xpath.select('//*[local-name()="Reason"]', doc).length;
            return indicators > 0;
        }
        catch {
            // Si parsing DOM impossible mais regex plus haut a échoué, considérer non-fault.
            return false;
        }
    }
    /** Version existante conservée pour rétro-compat : renvoie un message string. */
    static ParseBasError(soapEnv) {
        return this.ParseBasErrorDetailed(soapEnv).shortMessage;
    }
    /** Nouvelle version: renvoie la structure détaillée BasFaultInfo. */
    static ParseBasErrorDetailed(soapEnv) {
        const xml = decodeXmlEntities(soapEnv);
        const fault = { shortMessage: 'SOAP Fault', raw: xml };
        try {
            const doc = new xmldom_1.DOMParser().parseFromString(xml, 'text/xml');
            const faultcode = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="faultcode"])', doc);
            if (faultcode && faultcode.trim())
                fault.faultcode = faultcode.trim();
            const faultstring = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="faultstring"])', doc);
            if (faultstring && faultstring.trim())
                fault.faultstring = faultstring.trim();
            const reasonText = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="Reason"]/*[local-name()="Text"])', doc);
            if (reasonText && reasonText.trim())
                fault.reasonText = reasonText.trim();
            const details = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="Details"])', doc);
            if (details && details.trim())
                fault.details = details.trim();
            // State spécifique (exemple EBasRemotableException/State)
            const state = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="State"])', doc);
            if (state && state.trim())
                fault.state = state.trim();
        }
        catch {
            // Ignoré: on utilisera extraction regex dessous si nécessaire.
        }
        // Fallbacks regex si certains champs manquent
        if (!fault.faultcode)
            fault.faultcode = regexExtract('faultcode', xml);
        if (!fault.faultstring)
            fault.faultstring = regexExtract('faultstring', xml);
        if (!fault.details)
            fault.details = regexExtract('Details', xml);
        if (!fault.state)
            fault.state = regexExtract('State', xml);
        // Construction du message court priorisant faultstring puis reason
        const parts = [];
        if (fault.faultcode)
            parts.push(`[${fault.faultcode}]`);
        if (fault.faultstring)
            parts.push(fault.faultstring);
        else if (fault.reasonText)
            parts.push(fault.reasonText);
        else if (fault.details)
            parts.push(fault.details);
        fault.shortMessage = parts.length ? parts.join(' ') : 'SOAP Fault';
        return fault;
    }
}
exports.BasSoapFault = BasSoapFault;
