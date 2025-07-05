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
exports.sendSoapRequest = sendSoapRequest;
const xml2js_1 = require("xml2js");
const app_config_service_1 = require("./AppConfigService/app-config.service");
const BasAction_1 = require("../Model/Model-BasAction/BasAction");
const BasSoapClient_1 = require("../Model/Model-BasSoapClient/BasSoapClient");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const soap_parser_service_1 = require("../utils/soap-parser.service");
const clhttp = require('http');
const config = new app_config_service_1.AppConfigService;
const SOAP_URL = config.GetURlActionService();
const bsc = new BasSoapClient_1.BasSoapClient();
const runBasAct = new BasAction_1.BasAction(bsc, config);
async function sendSoapRequest(params, actionName, basSecurityContext) {
    // let SoapParser= new SoapParserService();
    const builder = new xml2js_1.Builder({ headless: true });
    const xml2js = await Promise.resolve().then(() => __importStar(require('xml2js')));
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    // ✅ Extraction propre de SessionId
    let sid = params["datanode"];
    if (!basSecurityContext) {
        console.warn("⚠️ Aucune SessionId fournie dans les paramètres !");
    }
    else {
        console.info("⚠️ SessionId et BasSec fournie dans les paramètres correctement!!" + basSecurityContext);
    }
    //console.log("✅ Inside SENDSOAPREQUEST - SessionId:", sid);
    const an = actionName ? actionName : "";
    const result = await runBasAct.RunAction(an, params, basSecurityContext ? basSecurityContext : new BasSecurityContext_1.BasSecurityContext()).then(response => {
        console.log("✅ Inside runBasAct - actionName====", actionName);
        if (actionName == "Xtlog_Get") {
            sid = "xtlog";
            console.log("✅ Inside runBasAct - actionName====", actionName);
            return (0, soap_parser_service_1.parseSoapXmlToJson)(response, sid);
        }
        else {
            return (0, soap_parser_service_1.parseSoapXmlToJson)(response, sid);
        }
    });
    //parser.parseStringPromise(response);
    return result;
    /*
     //* ✅ Construction de la requête SOAP
     const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
     <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://belair-info.com/bas/services">
       <soap:Body>
         <ns:RunAction>
           <sc xsi:type="ns:BasSecurityContext" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
             <SessionId xsi:type="xsd:string">${sid}</SessionId>
             <IsAuthenticated xsi:type="xsd:boolean">true</IsAuthenticated>
           </sc>
           <name xsi:type="xsd:string">${actionName}</name>
           <params xsi:type="ns:BasParams">
             <Items SOAP-ENC:arrayType="ns:BasParam[${Object.keys(params).length}]"
                    xsi:type="SOAP-ENC:Array"
                    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
               ${Object.entries(params).map(([key, value]) => `
                 <item xsi:type="ns:BasParam">
                   <Name xsi:type="xsd:string">${key}</Name>
                   <DataType xsi:type="ns:BasParamDataType">basParamString</DataType>
                   <StrVal xsi:type="xsd:string">${value}</StrVal>
                 </item>
               `).join('')}
             </Items>
           </params>
         </ns:RunAction>
       </soap:Body>
     </soap:Envelope>`;
   
     // ✅ Envoi SOAP via axios
     const response = await axios.post(SOAP_URL, soapEnvelope, {
       headers: {
         'Content-Type': 'text/xml; charset=utf-8',
         'SOAPAction': ''
       }
     });
   
     console.log("📨 SOAP response received.");
   
     // ✅ Parsing XML -> JSON
    // const xml2js = await import('xml2js');
     //const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });
     const result = await parser.parseStringPromise(response.data);
   
     return result
     */
}
