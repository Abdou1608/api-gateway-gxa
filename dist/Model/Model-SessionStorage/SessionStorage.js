"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorage = void 0;
const BasSecurityContext_1 = require("../BasSoapObject/BasSecurityContext");
class SessionStorage {
    get SESSION_ID_TOKEN() {
        return this._SESSION_ID_TOKEN;
    }
    set SESSION_ID_TOKEN(value) {
        this._SESSION_ID_TOKEN = value;
    }
    get SESSION_AUTHENTICATED() {
        return this._SESSION_AUTHENTICATED;
    }
    set SESSION_AUTHENTICATED(value) {
        this._SESSION_AUTHENTICATED = value;
    }
    constructor() {
        this._SESSION_ID_TOKEN = "SessionId";
        this._SESSION_AUTHENTICATED = "IsAuthenticated";
    }
    Set(key, value) {
        sessionStorage.setItem(key, value);
    }
    Get(key) {
        return String(sessionStorage.getItem(key));
    }
    Remove(key) {
        sessionStorage.removeItem(key);
    }
    TokenExists() {
        return (sessionStorage.getItem(this._SESSION_ID_TOKEN) !== null);
    }
    Clear() {
        sessionStorage.removeItem(this._SESSION_ID_TOKEN);
        sessionStorage.removeItem(this._SESSION_AUTHENTICATED);
    }
    SetContext(basSecurityContext) {
        sessionStorage.setItem(this._SESSION_ID_TOKEN, basSecurityContext.GetSessionId());
        sessionStorage.setItem(this._SESSION_AUTHENTICATED, String(basSecurityContext.GetIsAuthenticated()));
    }
    GetContext() {
        let basSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        basSecurityContext.SessionId = String(sessionStorage.getItem(this._SESSION_ID_TOKEN));
        basSecurityContext.IsAuthenticated = Boolean(sessionStorage.getItem(this._SESSION_AUTHENTICATED));
        return basSecurityContext;
    }
}
exports.SessionStorage = SessionStorage;
