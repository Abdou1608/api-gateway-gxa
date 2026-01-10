//import { HttpClient } from "@angular/common/http";
import { BasParams } from "../BasSoapObject/BasParams";
import { BasSecurityContext } from "../BasSoapObject/BasSecurityContext";
import { BasSoapClient } from "../Model-BasSoapClient/BasSoapClient";
import * as Xpath from "xpath";
import { BasSoapFault } from "../BasSoapObject/BasSoapFault";
import { AppConfigService } from "../../services/AppConfigService/app-config.service";

export class BasAction {
public http = require('http');
    constructor(private BasSoapCLient: BasSoapClient,  private appConfigService: AppConfigService) { }

    public async RunAction(actionName: string, basParams: BasParams, basSecurityContext: BasSecurityContext, xmldata?: string, ctx?: { userId?: string; domain?: string; password?: string; } | undefined): Promise<string> {
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

       console.log("Body de la requete est:====="+body)        
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlActionService(), body);
        console.log("BasSoapFault.IsBasError(response):====="+BasSoapFault.IsBasError(response)) 
    
        if (BasSoapFault.IsBasError(response)){
            console.log("response:====="+response) 

              BasSoapFault.ThrowError(response);
        }
        if (BasSoapFault.IsBasError(response)){
            console.log("response:====="+response) 

              BasSoapFault.ThrowError(response);
        }

        return response;
    }

    public GetLogEntry(soapEnv: string): Array<string> {
        let result = new Array<string>();
        return  result;    
    }

    public GetDataFromSoapEnv(soapEnv: string): string {
        let XmlParser: DOMParser = new DOMParser();
        let XmlDoc: Document = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
            {
                "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                "lg": "http://belair-info.com/bas/services"
            }
        );
        let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasActionResult/Data", XmlDoc);
        if ((val[0] as Node) !== undefined)
            return String((val[0] as Node).textContent);
        return "";
    }
}