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
exports.Bas4W = void 0;
const Xpath = __importStar(require("xpath"));
const BasSoapFault_1 = require("../BasSoapObject/BasSoapFault");
const Bas4WObject_1 = require("./Bas4WObject");
class Bas4W {
    get bas4WObject() {
        return this._bas4WObject;
    }
    constructor(BasSoapCLient, http, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.http = http;
        this.appConfigService = appConfigService;
        this._bas4WObject = new Bas4WObject_1.Bas4WObject();
    }
    async GetWebInfo(basSecurityContext, type) {
        let body = "";
        if ((type !== 0) && (basSecurityContext !== undefined))
            body = "<ns1:GetWebInfo>" + basSecurityContext.ToSoapVar() + `<bas4WebInfoType xsi:type=\"xsd:string\">bas4WebView</bas4WebInfoType>`;
        else
            body = `<ns1:GetWebInfo><sc xsi:type="ns1:BasSecurityContext"></sc><bas4WebInfoType xsi:type=\"xsd:string\">bas4WebInfoGeneric</bas4WebInfoType>`;
        body += '</ns1:GetWebInfo>';
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlB4WService(), body);
        if (BasSoapFault_1.BasSoapFault.IsBasError(response))
            BasSoapFault_1.BasSoapFault.ThrowError(response);
        return response;
    }
    GetDataFromSoapEnv(soapEnv) {
        let XmlParser = new DOMParser();
        let XmlDoc = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect = Xpath.useNamespaces({
            "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
            "lg": "http://belair-info.com/bas/services"
        });
        let val = XPathSelect("//envlp:Envelope/envlp:Body/lg:GetWebInfoResponse/return", XmlDoc);
        if (val[0] !== undefined)
            return String(val[0].textContent);
        return "";
    }
}
exports.Bas4W = Bas4W;
