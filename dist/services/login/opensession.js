"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opensession = opensession;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const BasAuthHelper_1 = require("../../Model/Model-BasAuth/BasAuthHelper");
const app_config_service_1 = require("../AppConfigService/app-config.service");
const BasSoapClient_1 = require("../../Model/Model-BasSoapClient/BasSoapClient");
const SessionStorage_1 = require("../../Model/Model-SessionStorage/SessionStorage");
async function opensession(logon, password, domain) {
    try {
        console.log("Début API opensession service avec les paramètres logon==" + logon + " password==" + password + " domain==" + domain);
        const params = new BasParams_1.BasParams();
        params.AddString("logon", logon);
        params.AddString("password", password);
        params.AddString("domain", domain ? domain : "");
        let sessionStorage = new SessionStorage_1.SessionStorage();
        const basSoapClient = new BasSoapClient_1.BasSoapClient();
        const appc = new app_config_service_1.AppConfigService();
        const auth = new BasAuthHelper_1.AuthenticationHelper(sessionStorage, basSoapClient, appc);
        const result = await auth.AuthenticateUser(logon, password, domain);
        console.log("!!!!!!!!Result opensession service==" + JSON.stringify(result));
        return result;
    }
    catch (error) {
        console.log("Erreur dans API dans opensession service==" + JSON.stringify(error));
        throw (error);
    }
}
