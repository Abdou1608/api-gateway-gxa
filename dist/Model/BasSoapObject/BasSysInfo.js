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
exports.BasSysInfo = void 0;
const Xpath = __importStar(require("xpath"));
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
class BasSysInfo {
    constructor() {
    }
    ToString() {
        return `
        ApplicationName -> ${this.ApplicationName}
        OsVersion -> ${this.OSVersionName}
        Version:
            * Major -> ${this.Major}
            * Minor -> ${this.Minor}
            * Release -> ${this.Release}
            * Revision -> ${this.Revision}
            * Version -> ${this.Version}
        TimeBias -> ${this.TimeBias}`;
    }
    LoadFromXml(xmlstring) {
        try {
            let XmlParser = new DOMParser();
            let XmlDoc = XmlParser.parseFromString(xmlstring, 'application/xml');
            let XPathSelect = Xpath.useNamespaces({
                "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                "lg": "urn:@Bas.Web.Services:BasAuthWebServiceImpl"
            });
            let val = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo", XmlDoc);
            if (val.length > 0) {
                this.GetApplicationNameFromXml(XmlDoc, XPathSelect);
                this.GetOsVersionFromXml(XmlDoc, XPathSelect);
                this.GetTimeBiasFromXml(XmlDoc, XPathSelect);
                this.GetMajorFromXml(XmlDoc, XPathSelect);
                this.GetMinorFromXml(XmlDoc, XPathSelect);
                this.GetReleaseFromXml(XmlDoc, XPathSelect);
                this.GetRevisionFromXml(XmlDoc, XPathSelect);
                this.GetVersionFromXml(XmlDoc, XPathSelect);
            }
            else {
                (0, soap_fault_handler_1.handleSoapResponse)(xmlstring, logger_1.default);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    GetApplicationNameFromXml(XmlDoc, XPathSelect) {
        let valApplicationName = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/ApplicationName", XmlDoc);
        if (valApplicationName.length > 0) {
            if (valApplicationName[0].textContent !== null)
                this.ApplicationName = String(valApplicationName[0].textContent);
        }
    }
    GetOsVersionFromXml(XmlDoc, XPathSelect) {
        let valOSVersionName = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/OSVersionName", XmlDoc);
        if (valOSVersionName.length > 0) {
            if (valOSVersionName[0].textContent !== null)
                this.OSVersionName = String(valOSVersionName[0].textContent);
        }
    }
    GetTimeBiasFromXml(XmlDoc, XPathSelect) {
        let valTimeBias = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/TimeBias", XmlDoc);
        if (valTimeBias.length > 0) {
            if (valTimeBias[0].textContent !== null)
                this.TimeBias = Number(valTimeBias[0].textContent);
        }
    }
    GetVersionFromXml(XmlDoc, XPathSelect) {
        let valVersion = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Version", XmlDoc);
        if (valVersion.length > 0) {
            if (valVersion[0].textContent !== null)
                this.Version = String(valVersion[0].textContent);
        }
    }
    GetMajorFromXml(XmlDoc, XPathSelect) {
        let valMajor = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Major", XmlDoc);
        if (valMajor.length > 0) {
            if (valMajor[0].textContent !== null)
                this.Major = Number(valMajor[0].textContent);
        }
    }
    GetMinorFromXml(XmlDoc, XPathSelect) {
        let valMinor = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Minor", XmlDoc);
        if (valMinor.length > 0) {
            if (valMinor[0].textContent !== null)
                this.Minor = Number(valMinor[0].textContent);
        }
    }
    GetReleaseFromXml(XmlDoc, XPathSelect) {
        let valRelease = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Release", XmlDoc);
        if (valRelease.length > 0) {
            if (valRelease[0].textContent !== null)
                this.Release = String(valRelease[0].textContent);
        }
    }
    GetRevisionFromXml(XmlDoc, XPathSelect) {
        let valRevision = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Revision", XmlDoc);
        if (valRevision.length > 0) {
            if (valRevision[0].textContent !== null)
                this.Revision = Number(valRevision[0].textContent);
        }
    }
}
exports.BasSysInfo = BasSysInfo;
