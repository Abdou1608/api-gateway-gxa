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
const clhttp = require('http');
const config = new app_config_service_1.AppConfigService;
const SOAP_URL = config.GetURlActionService();
const bsc = new BasSoapClient_1.BasSoapClient();
const runBasAct = new BasAction_1.BasAction(bsc, config);
async function sendSoapRequest(params, actionName, basSecurityContext, _sid, data) {
    // let SoapParser= new SoapParserService();
    //const builder = new Builder({ headless: true });
    //const xml2js = await import('xml2js');
    //const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    // ✅ Extraction propre de SessionId
    let sid = _sid ?? "";
    let xmldata = "";
    if (!basSecurityContext) {
        // console.warn("⚠️ Aucune SessionId fournie dans les paramètres !");
        throw new Error("Aucune Identité n'est fournie");
    }
    else {
        console.log("✅ Inside ----------------------------------------------------------------");
        if (data && data !== "") {
            console.log("✅ Inside ----------------------------------------------------------------");
            if ((sid === "cont") && (actionName !== "Cont_NewPiece")) {
                xmldata = (0, cont_to_xml_service_1.contModelToXml)(data);
                console.log("----------------------------xmldata = contModelToXml(data)-------------------------------------------");
                console.log("Data envoyé=" + xmldata);
                console.log("_____________________________________________________________________");
            }
            else if (sid === "risk") {
                xmldata = (0, xml_parser_1.objectToXML)(data, sid);
                //objectToCustomXML(data,sid)
                //
                console.log("----------------------------xmldata = objectToXML(data)-------------------------------------------");
                console.log("Data envoyé=" + xmldata);
                console.log("_____________________________________________________________________");
            }
            else {
                xmldata = (0, xml_parser_1.objectToCustomXML)(data, sid);
                console.log("----------------------------xmldata = objectToCustomXML(data)-------------------------------------------");
                console.log("Data envoyé=" + xmldata);
                console.log("_____________________________________________________________________");
            }
            // xmldata=`<Data>${xmldata}</Data>`
            console.log("✅ Inside ----------------------------------------------------------------");
            //  console.log("✅ Inside SENDSOAPREQUEST - Data====:", xmldata);
            console.log("✅ Fin Data ----------------------------------------------------------------");
        }
        // console.info("⚠️ SessionId et BasSec fournie dans les paramètres correctement!!"+basSecurityContext);}
        // console.log("✅ Inside SENDSOAPREQUEST - actionName:", actionName);
        console.log("✅ Inside SENDSOAPREQUEST - sid:", sid);
        const an = actionName ? actionName : "";
        const result = await runBasAct.RunAction(an, params, basSecurityContext ? basSecurityContext : new BasSecurityContext_1.BasSecurityContext(), xmldata).then(async (response) => {
            console.log("✅ Inside runBasAct - actionName====", actionName);
            console.log("✅ Inside runBasAct - response====", response);
            if (sid == "produit" || actionName == "Produit_Details") {
                // console.log("✅ Inside runBasAct - reponse du SOAP avant parser====", response);
                return await (0, soap_parser_service_1.parseProdSoapResponse)(response);
            }
            //  if (actionName === "Xtlog_Get"){
            //  return  parseSoapXmlToJson(response,sid)
            // }
            else if (sid == "prod") {
                return (0, soap_parser_service_1.parseProdSoapResponse)(response);
            }
            else if (sid === "tab") {
                return (0, soap_parser_service_1.parseTabRowsXml)(response);
            }
            else if ((sid === "offers") || (sid === "offer") || (sid === "Offer")) {
                // console.log("✅ Inside runBasAct - Else sid====offres || sid===projects======"+ response);
                return await (0, soap_parser_service_1.parseSoapEmbeddedXmlToJson)(response, "offers");
                //return parseSoapXmlToJson(response,sid)
            }
            else if ((sid === "projects") || (sid === "project") || (sid === "Project")) {
                // console.log("✅ Inside runBasAct - Else sid====offres || sid===projects======"+ response);
                return await (0, soap_parser_service_1.parseSoapEmbeddedXmlToJson)(response, "projects");
                //return parseSoapXmlToJson(response,sid)
            }
            else {
                return await (0, soap_parser_service_1.parseSoapXmlToJson)(response, sid);
            }
        }).catch(e => { return "Erreur d'extraction des données :" + e; });
        //parser.parseStringPromise(response);
        if (JSON.stringify(result).includes("Erreur d'extraction des données :")) {
            throw new Error(JSON.stringify(result));
        }
        else {
            return result;
        }
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
}
