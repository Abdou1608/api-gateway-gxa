"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasAuth = void 0;
const BasAppInfo_1 = require("../BasSoapObject/BasAppInfo");
const BasSecurityContext_1 = require("../BasSoapObject/BasSecurityContext");
const BasSysInfo_1 = require("../BasSoapObject/BasSysInfo");
class BasAuth {
    constructor(BasSoapCLient, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.appConfigService = appConfigService;
    }
    async OpenSession(BasLogin, BasPassword, BasDomain) {
        let body = `<ns1:OpenSession><logon xsi:type="xsd:string">${BasLogin}</logon><password xsi:type="xsd:string">${BasPassword}</password><domain xsi:type="xsd:string">${BasDomain}</domain></ns1:OpenSession>`;
        let result = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlAuthService(), body);
        console.log("!!!!!!!!!!!!!!!!!!!Result OpenSession BasAuth: " + result);
        let basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.LoadFromXml(result);
        return basSecurityContext;
    }
    async CloseSession(basSecurityContext) {
        let body = "<ns1:CloseSession>" + basSecurityContext.ToSoapVar() + "</ns1:CloseSession>";
        await this.BasSoapCLient.soapVoidRequest(this.appConfigService.GetURlAuthService(), body);
        basSecurityContext.Clean();
    }
    async CheckSession(basSecurityContext) {
        let body = "<ns1:CheckSession>" + basSecurityContext.ToSoapVar() + "</ns1:CheckSession>";
        await this.BasSoapCLient.soapVoidRequest(this.appConfigService.GetURlAuthService(), body);
        return true;
    }
    async Echo(message) {
        let body = `<ns1:Echo><message xsi:type="xsd:string">${message}</message></ns1:Echo>`;
        let result = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlAuthService(), body);
        return result;
    }
    async GetAppInfo(basSecurityContext) {
        let body = "<ns1:GetAppInfo>" + basSecurityContext.ToSoapVar() + "</ns1:GetAppInfo>";
        let result = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlAuthService(), body);
        let basAppInfo = new BasAppInfo_1.BasAppInfo();
        basAppInfo.LoadFromXml(result);
        return basAppInfo.ToString();
    }
    async GetSysInfo() {
        let result = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlAuthService(), "<ns1:GetSysInfo/>");
        let basSysInfo = new BasSysInfo_1.BasSysInfo();
        basSysInfo.LoadFromXml(result);
        return basSysInfo.ToString();
    }
}
exports.BasAuth = BasAuth;
