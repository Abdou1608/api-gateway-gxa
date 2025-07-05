"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHelper = void 0;
const BasAuth_1 = require("./BasAuth");
class AuthenticationHelper {
    constructor(sessionStorage, basSoapClient, appConfigService) {
        this.sessionStorage = sessionStorage;
        this.basSoapClient = basSoapClient;
        this.appConfigService = appConfigService;
        this.basAuth = new BasAuth_1.BasAuth(this.basSoapClient, this.appConfigService);
    }
    //Method for performing basic authentication and fetch token and save in session model
    async AuthenticateUser(userName, password) {
        return this.basSecurityContext = await this.basAuth.OpenSession(userName, password);
        this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
        this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
        this.sessionStorage.SetContext(this.basSecurityContext);
    }
    async LogOut() {
        let basSecurityContext = this.sessionStorage.GetContext();
        if (basSecurityContext.GetSessionId() != undefined && basSecurityContext.GetSessionId() != null && basSecurityContext.GetSessionId() != "" && basSecurityContext.GetSessionId() != "null") {
            await this.basAuth.CloseSession(basSecurityContext);
        }
        this.sessionStorage.Clear();
    }
    //Method For Restoring the token values to session storage service — — -//
    SetSessionToken() {
        let basSecurityContext = this.sessionStorage.GetContext();
        if (basSecurityContext.GetSessionId() != undefined && basSecurityContext.GetSessionId() != null && basSecurityContext.GetSessionId() != "" && basSecurityContext.GetSessionId() != "null") {
            this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
            this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
        }
        else {
            basSecurityContext = this.getSecurityContext;
            this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
            this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
        }
        this.sessionStorage.SetContext(basSecurityContext);
    }
    //Method for getting access token from session model
    get getSecurityContext() {
        let accessToken;
        accessToken = this.sessionStorage.GetContext();
        return accessToken;
    }
    ClearSessions() {
        this.sessionStorage.Clear();
    }
    SessionsIsEmpty() {
        return !this.sessionStorage.TokenExists();
    }
    //Method for checking login state from auth guard
    async LoginState() {
        let _basSecurityContext = this.sessionStorage.GetContext();
        if (_basSecurityContext.GetIsAuthenticated()) {
            try {
                let result = await this.basAuth.CheckSession(_basSecurityContext);
                return result;
            }
            catch (error) {
                this.sessionStorage.Clear();
                return false;
            }
        }
        else {
            this.sessionStorage.Clear();
            return false;
        }
    }
}
exports.AuthenticationHelper = AuthenticationHelper;
