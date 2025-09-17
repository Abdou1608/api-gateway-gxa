import * as Xpath from "xpath";
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';

export class BasAppInfo {

    private ConfFileName!: string;
    private Name!: string;
    private Title!: string;

    constructor() {
    }

    public ToString(): string {
        return `
        ConfFileName -> ${this.ConfFileName}
        Name -> ${this.Name}
        Title -> ${this.Title}`;
    }

    public LoadFromXml(xmlstring: string) {
        try {
            let XmlParser: DOMParser = new DOMParser();
            let XmlDoc: Document = XmlParser.parseFromString(xmlstring, 'application/xml');
            let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
                {
                    "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                    "lg": "urn:@Bas.Web.Services:BasAuthWebServiceImpl"
                }
            );
            let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo", XmlDoc);
            if (val.length > 0) {
                this.GetConfFileNameFromXml(XmlDoc, XPathSelect);
                this.GetNameFromXml(XmlDoc, XPathSelect);
                this.GetTitleFromXml(XmlDoc, XPathSelect);
            }
            else {
                handleSoapResponse(xmlstring, logger);
            }
        }
        catch (e: any) {
            throw new Error(e);
        }
    }


    private GetConfFileNameFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valConfFileName: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/ConfFileName", XmlDoc);
        if (valConfFileName.length > 0) {
            if ((valConfFileName[0] as Node).textContent !== null)
                this.ConfFileName = String((valConfFileName[0] as Node).textContent);
        }
    }

    private GetNameFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valName: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/Name", XmlDoc);
        if (valName.length > 0) {
            if ((valName[0] as Node).textContent !== null)
                this.Name = String((valName[0] as Node).textContent);
        }
    }

    private GetTitleFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valTitle: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasAppInfo/Title", XmlDoc);
        if (valTitle.length > 0) {
            if ((valTitle[0] as Node).textContent !== null)
                this.Title = String((valTitle[0] as Node).textContent);
        }
    }

}