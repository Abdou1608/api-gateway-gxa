import * as Xpath from "xpath";

export class BasSoapFault {

    public static ThrowError(soapEnv: string): void {
        let errorMsg : string = soapEnv;
        if (this.IsBasError(soapEnv))
            errorMsg = this.ParseBasError(soapEnv);
        throw errorMsg;
    }

    public static IsBasError(soapEnv: string): boolean {
        try {
            let XmlParser: DOMParser = new DOMParser();
            let XmlDoc: Document = XmlParser.parseFromString(soapEnv, 'application/xml');
            let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
                {
                    "envlp": "http://schemas.xmlsoap.org/soap/envelope/"
                }
            );
            let val: any = XPathSelect("//envlp:Envelope/envlp:Body/envlp:Fault", XmlDoc);
            if (val.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e: any) {
            return false;
        }
    }

    public static ParseBasError(soapEnv: string): string {
        try {
            let XmlParser: DOMParser = new DOMParser();
            let XmlDoc: Document = XmlParser.parseFromString(soapEnv, 'application/xml');
            let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
                {
                    "envlp": "http://schemas.xmlsoap.org/soap/envelope/"
                }
            );
            let val: any = XPathSelect("//envlp:Envelope/envlp:Body/envlp:Fault", XmlDoc);
            if (val.length > 0) {
                let soapFaultString: any = XPathSelect("//envlp:Envelope/envlp:Body/envlp:Fault/faultstring", XmlDoc);
                if (soapFaultString.length > 0) 
                    return String((soapFaultString[0] as Node).textContent);
                else
                  return String((val[0] as Node).textContent);
            }
            else {
                return soapEnv;
            }
        }
        catch (e: any) {
            return soapEnv;
        }
    }
}