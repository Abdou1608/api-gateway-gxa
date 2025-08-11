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
class BasSoapFault {
    static ThrowError(soapEnv) {
        const msg = this.IsBasError(soapEnv) ? this.ParseBasError(soapEnv) : soapEnv;
        throw new Error(msg);
    }
    static IsBasError(soapEnv) {
        if (!soapEnv)
            return false;
        try {
            // IMPORTANT: ne pas passer d'options ici (évite TS2322/TS2353)
            const doc = new xmldom_1.DOMParser().parseFromString(soapEnv, 'text/xml');
            // Détection principale : <Envelope>/<Body>/<Fault> (agnostique aux préfixes)
            const faultNodes = Xpath.select('//*[local-name()="Envelope"]/*[local-name()="Body"]/*[local-name()="Fault"]', doc);
            if (faultNodes && faultNodes.length > 0)
                return true;
            // Indices secondaires : faultcode/faultstring
            const hintCount = Xpath.select('//*[local-name()="faultcode"]', doc).length +
                Xpath.select('//*[local-name()="faultstring"]', doc).length;
            return hintCount > 0;
        }
        catch {
            // XML mal formé : dernier filet par regex
            return /<([A-Za-z0-9\-_]+:)?Fault\b/i.test(soapEnv);
        }
    }
    static ParseBasError(soapEnv) {
        try {
            const doc = new xmldom_1.DOMParser().parseFromString(soapEnv, 'text/xml');
            // 1) SOAP 1.1: <faultstring>
            const faultString = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="faultstring"])', doc);
            if (faultString && String(faultString).trim().length > 0) {
                return String(faultString).trim();
            }
            // 2) SOAP 1.2: <Reason>/<Text>
            const reasonText = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="Reason"]/*[local-name()="Text"])', doc);
            if (reasonText && String(reasonText).trim().length > 0) {
                return String(reasonText).trim();
            }
            // 3) Détail applicatif: .../detail/.../Details
            const details = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="Details"])', doc);
            if (details && String(details).trim().length > 0) {
                return String(details).trim();
            }
            // 4) Fallback: texte du noeud Fault
            const faultTextNode = Xpath.select('string(//*[local-name()="Fault"])', doc);
            if (faultTextNode && String(faultTextNode).trim().length > 0) {
                return String(faultTextNode).trim();
            }
            // Si rien trouvé, renvoyer le XML brut
            return soapEnv;
        }
        catch {
            return soapEnv;
        }
    }
}
exports.BasSoapFault = BasSoapFault;
