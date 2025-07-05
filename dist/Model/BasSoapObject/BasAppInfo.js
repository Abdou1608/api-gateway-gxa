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
exports.BasAppInfo = void 0;
const Xpath = __importStar(require("xpath"));
const BasSoapFault_1 = require("./BasSoapFault");
class BasAppInfo {
    constructor() {
    }
    ToString() {
        return `
        ConfFileName -> ${this.ConfFileName}
        Name -> ${this.Name}
        Title -> ${this.Title}`;
    }
    LoadFromXml(xmlstring) {
        try {
            let XmlParser = new DOMParser();
            let XmlDoc = XmlParser.parseFromString(xmlstring, 'application/xml');
            let XPathSelect = Xpath.useNamespaces({
                "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                "lg": "urn:@Bas.Web.Services:BasAuthWebServiceImpl"
            });
            let val = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo", XmlDoc);
            if (val.length > 0) {
                this.GetConfFileNameFromXml(XmlDoc, XPathSelect);
                this.GetNameFromXml(XmlDoc, XPathSelect);
                this.GetTitleFromXml(XmlDoc, XPathSelect);
            }
            else {
                BasSoapFault_1.BasSoapFault.ThrowError(xmlstring);
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    GetConfFileNameFromXml(XmlDoc, XPathSelect) {
        let valConfFileName = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/ConfFileName", XmlDoc);
        if (valConfFileName.length > 0) {
            if (valConfFileName[0].textContent !== null)
                this.ConfFileName = String(valConfFileName[0].textContent);
        }
    }
    GetNameFromXml(XmlDoc, XPathSelect) {
        let valName = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/Name", XmlDoc);
        if (valName.length > 0) {
            if (valName[0].textContent !== null)
                this.Name = String(valName[0].textContent);
        }
    }
    GetTitleFromXml(XmlDoc, XPathSelect) {
        let valTitle = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/Title", XmlDoc);
        if (valTitle.length > 0) {
            if (valTitle[0].textContent !== null)
                this.Title = String(valTitle[0].textContent);
        }
    }
}
exports.BasAppInfo = BasAppInfo;
