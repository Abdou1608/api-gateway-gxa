"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasSecurityContext = void 0;
const soap_fault_handler_1 = require("../../utils/soap-fault-handler");
const logger_1 = __importDefault(require("../../utils/logger"));
const fast_xml_parser_1 = require("fast-xml-parser");
class BasSecurityContext {
    get SessionId() {
        return this._SessionId;
    }
    set SessionId(value) {
        this._SessionId = value;
    }
    get IsAuthenticated() {
        return this._IsAuthenticated;
    }
    set IsAuthenticated(value) {
        this._IsAuthenticated = value;
    }
    constructor() {
        this._SessionId = "";
        this._IsAuthenticated = false;
    }
    LoadFromXml(xmlstring) {
        //  console.log("Dans LoadFromXml de BasSecurityContext ==>", xmlstring);
        try {
            const parser = new fast_xml_parser_1.XMLParser({
                ignoreAttributes: true,
            });
            const jsonObj = parser.parse(xmlstring);
            const envelope = jsonObj['SOAP-ENV:Envelope'] || jsonObj['envlp:Envelope'];
            const body = envelope?.['SOAP-ENV:Body'] || envelope?.['envlp:Body'];
            console.log("Dans LoadFromXml de BasSecurityContext,  body==>", body);
            const context = body?.['lg:BasSecurityContext'] || body?.['BasSecurityContext'] || body?.['NS1:BasSecurityContext'];
            console.log("Dans LoadFromXml de BasSecurityContext,  context.SessionId==>", context.SessionId);
            if (context) {
                this.SessionId = context.SessionId || null;
                console.log("Dans LoadFromXml de BasSecurityContext, If context,  this.SessionId==>", this.SessionId);
                this.IsAuthenticated = context.IsAuthenticated === 'true' || context.IsAuthenticated === true || context.IsAuthenticated['#text'] === true;
            }
            else {
                (0, soap_fault_handler_1.handleSoapResponse)(xmlstring, logger_1.default); // lèvera AppError si Fault
            }
        }
        catch (e) {
            throw new Error(`Erreur lors du parsing XML: ${e.message}`);
        }
    }
    GetSessionId() {
        return this.SessionId;
    }
    GetIsAuthenticated() {
        return this.IsAuthenticated;
    }
    ToSoapVar() {
        return `<sc xsi:type="ns1:BasSecurityContext"><SessionId xsi:type="xsd:string">${this.SessionId}</SessionId><IsAuthenticated xsi:type="xsd:boolean">${this.IsAuthenticated}</IsAuthenticated></sc>`;
    }
    Clean() {
        this.SessionId = "";
        this.IsAuthenticated = false;
    }
}
exports.BasSecurityContext = BasSecurityContext;
