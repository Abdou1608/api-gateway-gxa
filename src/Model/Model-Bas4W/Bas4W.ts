import * as HttpClient  from "axios";
import { BasSecurityContext } from "../BasSoapObject/BasSecurityContext";
import { BasSoapClient } from "../Model-BasSoapClient/BasSoapClient";
import * as Xpath from "xpath";
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';
import { Bas4WObject } from "./Bas4WObject";
import { AppConfigService } from "../../services/AppConfigService/app-config.service";

export class Bas4W {

    private _bas4WObject: Bas4WObject = new Bas4WObject();

    public get bas4WObject(): Bas4WObject {
        return this._bas4WObject;
      }

    constructor(private BasSoapCLient: BasSoapClient, private http: HttpClient.AxiosInstance, private appConfigService: AppConfigService) { }

    public async GetWebInfo(basSecurityContext: BasSecurityContext | undefined, type: number): Promise<string> {
        let body = "";
        if ((type !== 0) && (basSecurityContext !== undefined))
            body = "<ns1:GetWebInfo>" + basSecurityContext.ToSoapVar() + `<bas4WebInfoType xsi:type=\"xsd:string\">bas4WebView</bas4WebInfoType>`;
        else
            body = `<ns1:GetWebInfo><sc xsi:type="ns1:BasSecurityContext"></sc><bas4WebInfoType xsi:type=\"xsd:string\">bas4WebInfoGeneric</bas4WebInfoType>`;
        body += '</ns1:GetWebInfo>';         
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlB4WService(), body);
        response = handleSoapResponse(response, logger);
        return response;       
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
        let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:GetWebInfoResponse/return", XmlDoc);
        if ((val[0] as Node) !== undefined)
            return String((val[0] as Node).textContent);
        return "";
    }
}