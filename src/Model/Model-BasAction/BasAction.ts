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

    public async RunAction(actionName: string, basParams: BasParams, basSecurityContext: BasSecurityContext): Promise<string> {
        let body = "<ns1:RunAction>" + basSecurityContext.ToSoapVar() + `<name xsi:type=\"xsd:string\">${actionName}</name>`;
        body += basParams.ToSoapVar();
        body += '</ns1:RunAction>';         
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlActionService(), body);
        if (BasSoapFault.IsBasError(response))
            BasSoapFault.ThrowError(response);
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