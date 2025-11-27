"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSoapRequest = sendSoapRequest;
const app_config_service_1 = require("./AppConfigService/app-config.service");
const BasAction_1 = require("../Model/Model-BasAction/BasAction");
const BasSoapClient_1 = require("../Model/Model-BasSoapClient/BasSoapClient");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const soap_parser_service_1 = require("../utils/soap-parser.service");
const xml_parser_1 = require("../utils/xml-parser");
const cont_to_xml_service_1 = require("./create_contrat/cont_to_xml.service");
const BasSoapFault_1 = require("../Model/BasSoapObject/BasSoapFault");
const errors_1 = require("../common/errors");
const user_queue_1 = require("../lib/user-queue");
const soap_safe_1 = require("./soap-safe");
const risk_xml_serializer_1 = require("../utils/risk-xml-serializer");
const soap_error_detector_1 = require("../utils/soap-error-detector");
//import {  parseSoapOffersToRows } from '../utils/new-soap-parser.service';
const clhttp = require('http');
const config = new app_config_service_1.AppConfigService;
const SOAP_URL = config.GetURlActionService();
const bsc = new BasSoapClient_1.BasSoapClient();
const runBasAct = new BasAction_1.BasAction(bsc, config);
async function sendSoapRequest(params, actionName, basSecurityContext, _sid, data, ctx) {
    // let SoapParser= new SoapParserService();
    //const builder = new Builder({ headless: true });
    //const xml2js = await import('xml2js');
    //const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    // ✅ Extraction propre de SessionId
    let sid = _sid ?? "";
    let xmldata = "";
    if (!basSecurityContext) {
        throw new errors_1.ValidationError("Aucune identité n'est fournie", [{ path: 'BasSecurityContext', message: 'manquant' }]);
    }
    else {
        //console.log("✅ Inside ----------------------------------------------------------------");
        if (data && data !== "") {
            //console.log("✅ Inside ----------------------------------------------------------------");
            if ((sid === "cont") && (actionName !== "Cont_NewPiece")) {
                xmldata = (0, cont_to_xml_service_1.contModelToXml)(data);
                //console.log("----------------------------xmldata = contModelToXml(data)-------------------------------------------")
                //console.log("Data envoyé="+xmldata)
                //console.log("_____________________________________________________________________")
            }
            else if (sid == "quit" || sid == "Project") {
                xmldata = (0, xml_parser_1.objectToXML)(data, sid);
                //objectToCustomXML(data,sid)
                //
                //console.log("----------------------------xmldata = objectToXML(data)-------------------------------------------")
                //console.log("Data envoyé="+xmldata)
                //console.log("_____________________________________________________________________")
            }
            else if (sid === "risk") {
                xmldata = (0, risk_xml_serializer_1.riskModelToEscapedStrVal)(data, sid);
            }
            else {
                const xmlPropre = (0, xml_parser_1.objectToCustomXML)(data, sid); // <data><input><objects>…</objects></input></data>
                const strValXML = (0, xml_parser_1.objectToCustomXMLForStrVal)(data, sid);
                xmldata = strValXML;
                console.log("----------------------------xmldata = objectToCustomXML(data)-------------------------------------------");
                //console.log("Data envoyé="+xmldata)
                //console.log("_____________________________________________________________________")
            }
            // xmldata=`<Data>${xmldata}</Data>`
            //console.log("✅ Inside ----------------------------------------------------------------");
            //  //console.log("✅ Inside SENDSOAPREQUEST - Data====:", xmldata);
            //console.log("✅ Fin Data ----------------------------------------------------------------");
        }
        // console.info("⚠️ SessionId et BasSec fournie dans les paramètres correctement!!"+basSecurityContext);}
        // //console.log("✅ Inside SENDSOAPREQUEST - actionName:", actionName);
        //console.log("✅ Inside SENDSOAPREQUEST - sid:", sid);
        const an = actionName ? actionName : "";
        const actionRun = () => runBasAct.RunAction(an, params, basSecurityContext ? basSecurityContext : new BasSecurityContext_1.BasSecurityContext(), xmldata, ctx);
        const resilientCall = () => (0, soap_safe_1.callSoapWithResilience)(bsc, actionRun);
        const result = await (0, user_queue_1.withUserQueue)(ctx?.userId, ctx?.domain, resilientCall)
            .then(async (response) => {
            if (BasSoapFault_1.BasSoapFault.IsBasError(response)) {
                const f = BasSoapFault_1.BasSoapFault.ParseBasErrorDetailed(response);
                throw new errors_1.SoapServerError('SOAP.FAULT', f.faultstring || 'SOAP Fault', { soapFault: { faultcode: f.faultcode, faultstring: f.faultstring, detail: f.details, state: f.state } });
            }
            const businessError = (0, soap_error_detector_1.detectSoapError)(response);
            if (businessError) {
                throw new errors_1.SoapServerError(businessError.code ?? 'SOAP.BUSINESS_ERROR', businessError.message, {
                    source: businessError.kind,
                    logEntries: businessError.entries,
                    rawResponseSnippet: businessError.rawSnippet,
                });
            }
            //console.log("✅ Inside runBasAct - actionName====", actionName);
            //console.log("✅ Inside runBasAct - response====", response);
            // Si aucune erreur, on traite les données selon le `sid`
            if (sid === "produit" || sid === "Produit") {
                return { success: true, data: await (0, soap_parser_service_1.parseProdSoapResponse)(response) };
            }
            else if (sid === "prod") {
                return { success: true, data: (0, soap_parser_service_1.parseProdSoapResponse)(response) };
            }
            else if (sid === "contrat" || sid === "cont_") {
                return { success: true, data: (0, soap_parser_service_1.parseTabRowsXml)(response) };
            }
            else if (sid === "tab") {
                return { success: true, data: (0, soap_parser_service_1.parseTabRowsXml)(response) };
            }
            else if (sid === "tabs") {
                return { success: true, data: (0, soap_parser_service_1.parseSoapXmlToJson)(response, sid) };
            }
            else if (["offers", "offer", "Offer"].includes(sid)) {
                return { success: true, data: await (0, soap_parser_service_1.parseSoapEmbeddedXmlToJson)(response, "offers") };
            }
            else if (["projects", "project", "Project"].includes(sid)) {
                return { success: true, data: await (0, soap_parser_service_1.parseSoapEmbeddedXmlToJson)(response, sid) };
            }
            else if (sid === "project-detail" || sid === "cont_listitems") {
                return { success: true, data: (0, soap_parser_service_1.parseSoapEmbeddedXmlToJson)(response, "Tarc0") };
            }
            else {
                console.warn("⚠️ Unhandled SID:", sid);
                // console.log("⚠️ Response!!!!!!   :", response);
                return { success: true, data: await (0, soap_parser_service_1.parseSoapXmlToJson)(response, sid) };
            }
        })
            .catch((e) => {
            // Laisser l'erreur typer remonter, sinon rewrap en TransformError
            if (e instanceof errors_1.SoapServerError || e instanceof errors_1.ValidationError)
                throw e;
            throw new errors_1.TransformError("Erreur d'extraction des données", { step: 'parse', inputSnippet: (typeof data === 'string' ? data.slice(0, 200) : undefined) }, e);
        });
        if ('data' in result) {
            return result.data;
        }
        throw new errors_1.InternalError("Unexpected result structure: missing 'data' property.");
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
       
         //console.log("📨 SOAP response received.");
       
         // ✅ Parsing XML -> JSON
        // const xml2js = await import('xml2js');
         //const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });
         const result = await parser.parseStringPromise(response.data);
       
         return result
         */
    }
}
