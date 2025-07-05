"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closesession_ = closesession_;
const BasAuthHelper_1 = require("../../Model/Model-BasAuth/BasAuthHelper");
const BasSoapClient_1 = require("../../Model/Model-BasSoapClient/BasSoapClient");
const SessionStorage_1 = require("../../Model/Model-SessionStorage/SessionStorage");
const app_config_service_1 = require("../AppConfigService/app-config.service");
async function closesession_(bassecuritycontext) {
    let sessionStorage = new SessionStorage_1.SessionStorage();
    const basSoapClient = new BasSoapClient_1.BasSoapClient();
    const appc = new app_config_service_1.AppConfigService();
    const auth = new BasAuthHelper_1.AuthenticationHelper(sessionStorage, basSoapClient, appc);
    const result = await auth.LogOut();
    return result;
}
