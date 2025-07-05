
import { BasSoapClient } from "../Model-BasSoapClient/BasSoapClient";

import { BasSecurityContext } from "../BasSoapObject/BasSecurityContext";
import { BasSoapFault } from "../BasSoapObject/BasSoapFault";
import { AppConfigService } from "../../services/AppConfigService/app-config.service";

export class BasWebAuthService {

    constructor(private BasSoapCLient: BasSoapClient,  private appConfigService: AppConfigService) { }

    public async Set(basSecurityContext: BasSecurityContext): Promise<string> {
        let body = `<ns1:GetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:GetWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        if (BasSoapFault.IsBasError(response))
            BasSoapFault.ThrowError(response);
        return response;
    }

    public async Get(basSecurityContext: BasSecurityContext, jsonStr: string): Promise<string> {
        let body = `<ns1:SetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:SetWebInfo><basWebInfo xsi:type=\"xsd:string\">${jsonStr}</basWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        if (BasSoapFault.IsBasError(response))
            BasSoapFault.ThrowError(response);
        return response;  
    }
}