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
exports.BasSoapClient = void 0;
const axios_1 = __importDefault(require("axios"));
const BasSoapFault_1 = require("../BasSoapObject/BasSoapFault");
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class BasSoapClient {
    constructor() {
        this.SoapHeader = '';
        this.SoapFooter = '';
        this.SoapHeader = '';
        this.SoapFooter = '';
    }
    async getFileContent(file) {
        const filePath = path.resolve(file);
        return await fs.readFile(filePath, 'utf-8');
    }
    headerAndFooterNotLoaded() {
        return this.SoapFooter === '' || this.SoapHeader === '';
    }
    async loadHeaderAndFooter() {
        this.SoapHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
        this.SoapHeader += `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"`;
        this.SoapHeader += ` xmlns:ns1="http://belair-info.com/bas/services"`;
        this.SoapHeader += ` xmlns:xsd="http://www.w3.org/2001/XMLSchema"`;
        this.SoapHeader += ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`;
        this.SoapHeader += ` xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"`;
        this.SoapHeader += ` SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">`;
        this.SoapHeader += `<SOAP-ENV:Body>`;
        this.SoapFooter = `</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
    }
    async soapRequest(url, request) {
        if (this.headerAndFooterNotLoaded()) {
            await this.loadHeaderAndFooter();
        }
        const soapEnvelope = this.SoapHeader + request + this.SoapFooter;
        try {
            const response = await axios_1.default.post(url, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                },
                responseType: 'text',
            });
            // Centralisation: on laisse handleSoapResponse détecter et lever une AppError au besoin
            const safeXml = (0, soap_fault_handler_1.handleSoapResponse)(response.data, logger_1.default);
            return safeXml;
        }
        catch (error) {
            // Si la requête a déjà retourné un XML de fault dans error.response.data, on laisse BasSoapFault pour compat rétro
            const payload = (error?.response?.data ?? error?.response) || error?.message || JSON.stringify(error);
            if (BasSoapFault_1.BasSoapFault.IsBasError(payload)) {
                // handleSoapResponse lèvera AppError normalisée
                (0, soap_fault_handler_1.handleSoapResponse)(payload, logger_1.default);
            }
            throw error; // Pas une fault SOAP -> propager l'erreur axios originale
        }
    }
    async soapVoidRequest(url, request) {
        if (this.headerAndFooterNotLoaded()) {
            await this.loadHeaderAndFooter();
        }
        const soapEnvelope = this.SoapHeader + request + this.SoapFooter;
        try {
            const response = await axios_1.default.post(url, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                },
                responseType: 'text',
            });
            if (response.status === 200 && response.data) {
                (0, soap_fault_handler_1.handleSoapResponse)(response.data, logger_1.default);
            }
        }
        catch (error) {
            const payload = error?.response?.data || error.message;
            if (BasSoapFault_1.BasSoapFault.IsBasError(payload))
                (0, soap_fault_handler_1.handleSoapResponse)(payload, logger_1.default);
            throw error;
        }
    }
}
exports.BasSoapClient = BasSoapClient;
