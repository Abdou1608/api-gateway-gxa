"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasWebAuthService = void 0;
const BasSoapFault_1 = require("../BasSoapObject/BasSoapFault");
class BasWebAuthService {
    constructor(BasSoapCLient, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.appConfigService = appConfigService;
    }
    async Set(basSecurityContext) {
        let body = `<ns1:GetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:GetWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        if (BasSoapFault_1.BasSoapFault.IsBasError(response))
            BasSoapFault_1.BasSoapFault.ThrowError(response);
        return response;
    }
    async Get(basSecurityContext, jsonStr) {
        let body = `<ns1:SetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:SetWebInfo><basWebInfo xsi:type=\"xsd:string\">${jsonStr}</basWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        if (BasSoapFault_1.BasSoapFault.IsBasError(response))
            BasSoapFault_1.BasSoapFault.ThrowError(response);
        return response;
    }
}
exports.BasWebAuthService = BasWebAuthService;
