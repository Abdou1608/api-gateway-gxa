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
exports.BasAction = void 0;
const Xpath = __importStar(require("xpath"));
const BasSoapFault_1 = require("../BasSoapObject/BasSoapFault");
class BasAction {
    constructor(BasSoapCLient, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.appConfigService = appConfigService;
        this.http = require('http');
    }
    async RunAction(actionName, basParams, basSecurityContext, xmldata, ctx) {
        let body = "<ns1:RunAction>" + basSecurityContext.ToSoapVar() + `<name xsi:type=\"xsd:string\">${actionName}</name>`;
        //console.log("Dans RunAction xmldata est :====="+xmldata) 
        // Some SOAP actions (e.g. Project_AddOffer) are strict about argument count.
        // Only include the "data" param when we actually have payload XML.
        if (xmldata && xmldata !== "") {
            basParams.AddString("data", xmldata);
        }
        body += basParams.ToSoapVar();
        //body +="<params>"+(xmldata ?? "")+"</params>"
        //  if (xmldata && xmldata !== "") {
        //     body += `<data xsi:type=\"xsd:string\">${xmldata ?? ""}</data>`;
        // }
        body += '</ns1:RunAction>';
        console.log("Body de la requete est:=====" + body);
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlActionService(), body);
        console.log("BasSoapFault.IsBasError(response):=====" + BasSoapFault_1.BasSoapFault.IsBasError(response));
        if (BasSoapFault_1.BasSoapFault.IsBasError(response)) {
            console.log("response:=====" + response);
            BasSoapFault_1.BasSoapFault.ThrowError(response);
        }
        if (BasSoapFault_1.BasSoapFault.IsBasError(response)) {
            console.log("response:=====" + response);
            BasSoapFault_1.BasSoapFault.ThrowError(response);
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
