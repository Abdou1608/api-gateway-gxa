import { AppConfigService } from './AppConfigService/app-config.service';
import { BasAction } from '../Model/Model-BasAction/BasAction';
import { BasSoapClient } from '../Model/Model-BasSoapClient/BasSoapClient';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';

import {  parseProdSoapResponse, parseSoapXmlToJson } from '../utils/soap-parser.service';
import { BasParam } from '../Model/BasSoapObject/BasParam';

const clhttp = require('http')
const config =new AppConfigService
const SOAP_URL = config.GetURlActionService();
const bsc = new BasSoapClient()
const runBasAct=new BasAction(bsc, config)


export async function sendSoapRequest(params: any, actionName?: string, basSecurityContext?:BasSecurityContext, _sid?:string): Promise<any> {
 // let SoapParser= new SoapParserService();
  //const builder = new Builder({ headless: true });
  //const xml2js = await import('xml2js');
  
//const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

  // ✅ Extraction propre de SessionId
  let sid = _sid ?? "";
  if (!basSecurityContext) {
    console.warn("⚠️ Aucune SessionId fournie dans les paramètres !");
    throw new Error("Aucune Identité n'est fournie")
  }else{
    console.info("⚠️ SessionId et BasSec fournie dans les paramètres correctement!!"+basSecurityContext);}

  console.log("✅ Inside SENDSOAPREQUEST - actionName:", actionName);
  console.log("✅ Inside SENDSOAPREQUEST - sid:", sid);
  const an= actionName ? actionName: ""
    
    const result= await runBasAct.RunAction(an, params,basSecurityContext ? basSecurityContext : new BasSecurityContext()).then( response=>{
      console.log("✅ Inside runBasAct - actionName====", actionName);
      if (sid=="produit" || actionName=="Produit_Details"){
        console.log("✅ Inside runBasAct - reponse du SOAP avant parser====", response);
        }
      if (actionName === "Xtlog_Get"){
    return  parseSoapXmlToJson(response,sid)
    }
   if (sid=="prod"){
    return parseProdSoapResponse(response)
   }else{
    return parseSoapXmlToJson(response,sid)
   }
     
    }).catch(e => {return "Erreur d'extraction des données :"+e.message})
   
   //parser.parseStringPromise(response);

if (JSON.stringify( result).includes("Erreur d'extraction des données :")) {
  throw new Error(JSON.stringify( result))
} else {return result}
 
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
