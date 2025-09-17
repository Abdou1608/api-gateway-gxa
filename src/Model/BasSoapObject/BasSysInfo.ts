import * as Xpath from "xpath";
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';

export class BasSysInfo {

    private ApplicationName!: string;
    private OSVersionName!: string;
    private TimeBias!: number;
    private Version!: string;
    private Major!: number;
    private Minor!: number;
    private Release!: string;
    private Revision!: number;

    constructor() {
    }

    public ToString(): string {
        return `
        ApplicationName -> ${this.ApplicationName}
        OsVersion -> ${this.OSVersionName}
        Version:
            * Major -> ${this.Major}
            * Minor -> ${this.Minor}
            * Release -> ${this.Release}
            * Revision -> ${this.Revision}
            * Version -> ${this.Version}
        TimeBias -> ${this.TimeBias}`;
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
            let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo", XmlDoc);
            if (val.length > 0) {
                this.GetApplicationNameFromXml(XmlDoc, XPathSelect);
                this.GetOsVersionFromXml(XmlDoc, XPathSelect);
                this.GetTimeBiasFromXml(XmlDoc, XPathSelect);
                this.GetMajorFromXml(XmlDoc, XPathSelect);
                this.GetMinorFromXml(XmlDoc, XPathSelect);
                this.GetReleaseFromXml(XmlDoc, XPathSelect);
                this.GetRevisionFromXml(XmlDoc, XPathSelect);
                this.GetVersionFromXml(XmlDoc, XPathSelect);
            }
            else {
                handleSoapResponse(xmlstring, logger);
            }
        }
        catch (e: any) {
            throw new Error(e.message);
        }
    }

    private GetApplicationNameFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valApplicationName: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/ApplicationName", XmlDoc);
        if (valApplicationName.length > 0) {
            if ((valApplicationName[0] as Node).textContent !== null)
                this.ApplicationName = String((valApplicationName[0] as Node).textContent);
        }
    }

    private GetOsVersionFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valOSVersionName: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/OSVersionName", XmlDoc);
        if (valOSVersionName.length > 0) {
            if ((valOSVersionName[0] as Node).textContent !== null)
                this.OSVersionName = String((valOSVersionName[0] as Node).textContent);
        }
    }

    private GetTimeBiasFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valTimeBias: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasSysInfo/TimeBias", XmlDoc);
        if (valTimeBias.length > 0) {
            if ((valTimeBias[0] as Node).textContent !== null)
                this.TimeBias = Number((valTimeBias[0] as Node).textContent);
        }
    }

    private GetVersionFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valVersion: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Version", XmlDoc);
        if (valVersion.length > 0) {
            if ((valVersion[0] as Node).textContent !== null)
                this.Version = String((valVersion[0] as Node).textContent);
        }
    }

    private GetMajorFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valMajor: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Major", XmlDoc);
        if (valMajor.length > 0) {
            if ((valMajor[0] as Node).textContent !== null)
                this.Major = Number((valMajor[0] as Node).textContent);
        }
    }
    private GetMinorFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valMinor: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Minor", XmlDoc);
        if (valMinor.length > 0) {
            if ((valMinor[0] as Node).textContent !== null)
                this.Minor = Number((valMinor[0] as Node).textContent);
        }
    }

    private GetReleaseFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valRelease: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Release", XmlDoc);
        if (valRelease.length > 0) {
            if ((valRelease[0] as Node).textContent !== null)
                this.Release = String((valRelease[0] as Node).textContent);
        }
    }

    private GetRevisionFromXml(XmlDoc: Document, XPathSelect: Xpath.XPathSelect): void {
        let valRevision: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:VersionInfo/Revision", XmlDoc);
        if (valRevision.length > 0) {
            if ((valRevision[0] as Node).textContent !== null)
                this.Revision = Number((valRevision[0] as Node).textContent);
        }
    }
}
