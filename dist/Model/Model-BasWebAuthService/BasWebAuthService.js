"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasWebAuthService = void 0;
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
class BasWebAuthService {
    constructor(BasSoapCLient, appConfigService) {
        this.BasSoapCLient = BasSoapCLient;
        this.appConfigService = appConfigService;
    }
    async Set(basSecurityContext) {
        let body = `<ns1:GetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:GetWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        response = (0, soap_fault_handler_1.handleSoapResponse)(response, logger_1.default);
        return response;
    }
    async Get(basSecurityContext, jsonStr) {
        let body = `<ns1:SetWebInfo><sc xsi:type="ns1:BasSecurityContext">${basSecurityContext.ToSoapVar()}</sc></ns1:SetWebInfo><basWebInfo xsi:type=\"xsd:string\">${jsonStr}</basWebInfo>`;
        let response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetBasWebAuthService(), body);
        response = (0, soap_fault_handler_1.handleSoapResponse)(response, logger_1.default);
        return response;
    }
}
exports.BasWebAuthService = BasWebAuthService;
