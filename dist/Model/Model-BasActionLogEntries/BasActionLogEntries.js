"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasActionLogEntries = void 0;
const BasActionLogEntry_1 = require("./BasActionLogEntry");
const Xpath = __importStar(require("xpath"));
class BasActionLogEntries {
    get Errors() {
        return this._Errors;
    }
    get Warnings() {
        return this._Warnings;
    }
    get Infos() {
        return this._Infos;
    }
    constructor() {
        this._Errors = new Array;
        this._Warnings = new Array;
        this._Infos = new Array;
    }
    LoadEntries(soapEnv) {
        let XmlParser = new DOMParser();
        let XmlDoc = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect = Xpath.useNamespaces({
            "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
            "lg": "urn:@Bas.Web.Services:BasActionWebServiceImpl"
        });
        let val = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasActionLogEntry", XmlDoc);
        if (val.length > 0) {
            for (let i = 0; i < val.length; i++) {
                if (val[i] !== null) {
                    let type = String(val[i].childNodes[0].textContent);
                    let message = String(val[i].childNodes[1].textContent);
                    let state = Number(val[i].childNodes[2].textContent);
                    let basActionLogEntry = new BasActionLogEntry_1.BasActionLogEntry(type, message, state);
                    if (basActionLogEntry.EntryType == "basActionLogEntryError") {
                        this._Errors.push(basActionLogEntry);
                    }
                    else if (basActionLogEntry.EntryType == "basActionLogEntryInfo") {
                        this._Infos.push(basActionLogEntry);
                    }
                    else {
                        this._Warnings.push(basActionLogEntry);
                    }
                }
            }
        }
    }
}
exports.BasActionLogEntries = BasActionLogEntries;
