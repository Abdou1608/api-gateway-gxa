import { BasActionLogEntry } from "./BasActionLogEntry";
import * as Xpath from "xpath";
import { BaiOBjectHelper } from "../BasSoapObject/BaiObjectHelper";

export class BasActionLogEntries {

    private _Errors: Array<BasActionLogEntry>;
    public get Errors(): Array<BasActionLogEntry> {
        return this._Errors;
    }
    private _Warnings: Array<BasActionLogEntry>;
    public get Warnings(): Array<BasActionLogEntry> {
        return this._Warnings;
    }
    private _Infos: Array<BasActionLogEntry>;
    public get Infos(): Array<BasActionLogEntry> {
        return this._Infos;
    }

    constructor() {
        this._Errors = new Array<BasActionLogEntry>;
        this._Warnings = new Array<BasActionLogEntry>;
        this._Infos = new Array<BasActionLogEntry>;
    }

    public LoadEntries(soapEnv: string): void {
        let XmlParser: DOMParser = new DOMParser();
        let XmlDoc: Document = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
            {
                "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                "lg": "urn:@Bas.Web.Services:BasActionWebServiceImpl"
            }
        );
        let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasActionLogEntry", XmlDoc);
        if (val.length > 0) {
            for (let i = 0; i < val.length; i++) {                
                if (val[i] !== null) {
                    let type = String((val[i] as Node).childNodes[0].textContent);
                    let message = String((val[i] as Node).childNodes[1].textContent);
                    let state = Number((val[i] as Node).childNodes[2].textContent);
                    let basActionLogEntry = new BasActionLogEntry(type, message, state);
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