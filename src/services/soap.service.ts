import { AppConfigService } from './AppConfigService/app-config.service';
import { BasAction } from '../Model/Model-BasAction/BasAction';
import { BasSoapClient } from '../Model/Model-BasSoapClient/BasSoapClient';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';

import {  parseProdSoapResponse, parseSoapEmbeddedXmlToJson, parseSoapXmlToJson, parseTabRowsXml } from '../utils/soap-parser.service';
import { objectToCustomXML, objectToCustomXMLForStrVal, objectToXML } from '../utils/xml-parser';
import { contModelToXml } from './create_contrat/cont_to_xml.service';
import { BasSoapFault } from '../Model/BasSoapObject/BasSoapFault';
import { ValidationError, TransformError, SoapServerError, InternalError } from '../common/errors';
import { withUserQueue } from '../lib/user-queue';
import { callSoapWithResilience } from './soap-safe';
import { riskModelToEscapedStrVal } from '../utils/risk-xml-serializer';
import { detectSoapError } from '../utils/soap-error-detector';
//import {  parseSoapOffersToRows } from '../utils/new-soap-parser.service';


const clhttp = require('http')
const config =new AppConfigService
const SOAP_URL = config.GetURlActionService();
const bsc = new BasSoapClient()
const runBasAct=new BasAction(bsc, config)


export async function sendSoapRequest(params: any, actionName?: string, basSecurityContext?:BasSecurityContext, _sid?:string, data?:any, ctx?: { userId?: string; domain?: string; password?: string }): Promise<any> {
 // let SoapParser= new SoapParserService();
  //const builder = new Builder({ headless: true });
  //const xml2js = await import('xml2js');
  
//const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

  // ✅ Extraction propre de SessionId
  let sid = _sid ?? "";
  let xmldata:string=""
  if (!basSecurityContext) {
    throw new ValidationError("Aucune identité n'est fournie", [{ path: 'BasSecurityContext', message: 'manquant' }]);
  } else {
    //console.log("✅ Inside ----------------------------------------------------------------");

    if (data && data !== ""){
      //console.log("✅ Inside ----------------------------------------------------------------");
      if ((sid === "cont") && (actionName !== "Cont_NewPiece")){
        xmldata = contModelToXml(data)
        //console.log("----------------------------xmldata = contModelToXml(data)-------------------------------------------")
        //console.log("Data envoyé="+xmldata)
        //console.log("_____________________________________________________________________")
      }else if( sid=="quit" || sid=="Project"){
        xmldata =objectToXML(data,sid)
        //objectToCustomXML(data,sid)
        //
        //console.log("----------------------------xmldata = objectToXML(data)-------------------------------------------")
        //console.log("Data envoyé="+xmldata)
        //console.log("_____________________________________________________________________")
    
      }else if(sid==="risk"){
    xmldata = riskModelToEscapedStrVal(data, sid);}
   
  else{
    const xmlPropre = objectToCustomXML(data, sid);        // <data><input><objects>…</objects></input></data>
const strValXML = objectToCustomXMLForStrVal(data, sid);
      xmldata = strValXML
     
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
  const an= actionName ? actionName: ""
    
  const actionRun = () => runBasAct.RunAction(
      an,
      params,
      basSecurityContext ? basSecurityContext : new BasSecurityContext(),
      xmldata,
      ctx
    );

  const resilientCall = () => callSoapWithResilience(bsc, actionRun);

  const result = await withUserQueue(ctx?.userId, ctx?.domain, resilientCall)
    .then(async (response) => {
      if (BasSoapFault.IsBasError(response)) {
        const f = BasSoapFault.ParseBasErrorDetailed(response);
        throw new SoapServerError(
          'SOAP.FAULT',
          f.faultstring || 'SOAP Fault',
          { soapFault: { faultcode: f.faultcode, faultstring: f.faultstring, detail: f.details, state: f.state } }
        );
      }

      const businessError = detectSoapError(response);
      if (businessError) {
        throw new SoapServerError(
          businessError.code ?? 'SOAP.BUSINESS_ERROR',
          businessError.message,
          {
            source: businessError.kind,
            logEntries: businessError.entries,
            rawResponseSnippet: businessError.rawSnippet,
          }
        );
      }
  
      //console.log("✅ Inside runBasAct - actionName====", actionName);
      //console.log("✅ Inside runBasAct - response====", response);
  
      // Si aucune erreur, on traite les données selon le `sid`
      if (sid === "produit" || sid === "Produit") {
        return { success: true, data: await parseProdSoapResponse(response) };
      } else if (sid === "prod") {
        return { success: true, data: parseProdSoapResponse(response) };
      } else if (sid === "contrat" || sid === "cont_") {
        return { success: true, data: parseTabRowsXml(response) };
      } else if (sid === "tab") {
        return { success: true, data: parseTabRowsXml(response) };
        } else if (sid === "tabs") {
        return { success: true, data: parseSoapXmlToJson(response,sid) };
      } else if (["offers", "offer", "Offer"].includes(sid)) {
        return { success: true, data: await parseSoapEmbeddedXmlToJson(response, "offers") };
      } else if (["projects", "project", "Project"].includes(sid)) {
        return { success: true, data: await parseSoapEmbeddedXmlToJson(response, sid) };
      } else if (sid === "project-detail" || sid === "cont_listitems") {
        return { success: true, data: parseSoapEmbeddedXmlToJson(response, "Tarc0") };
      } else {
        console.warn("⚠️ Unhandled SID:", sid);
       // console.log("⚠️ Response!!!!!!   :", response);
        return { success: true, data: await parseSoapXmlToJson(response, sid) };
      }
    })
    .catch((e) => {
      // Laisser l'erreur typer remonter, sinon rewrap en TransformError
      if (e instanceof SoapServerError || e instanceof ValidationError) throw e;
      throw new TransformError("Erreur d'extraction des données", { step: 'parse', inputSnippet: (typeof data==='string'? data.slice(0,200): undefined) }, e);
    });

  if ('data' in result) {
    return result.data;
  }
  throw new InternalError("Unexpected result structure: missing 'data' property.");
 
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
}}
