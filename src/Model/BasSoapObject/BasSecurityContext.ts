
import * as Xpath from "xpath";
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';
import { XMLParser } from 'fast-xml-parser';

export class BasSecurityContext {

    private _SessionId: string = "";
    public get SessionId(): string {
        return this._SessionId;
    }
    public set SessionId(value: string) {
        this._SessionId = value;
    }
    private _IsAuthenticated: boolean = false;
    public get IsAuthenticated(): boolean {
        return this._IsAuthenticated;
    }
    public set IsAuthenticated(value: boolean) {
        this._IsAuthenticated = value;
    }

    constructor() {
    }

    public LoadFromXml(xmlstring: string) {
      //  console.log("Dans LoadFromXml de BasSecurityContext ==>", xmlstring);

        try {
            const parser = new XMLParser({
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
            } else {
                handleSoapResponse(xmlstring, logger); // lèvera AppError si Fault
            }
        } catch (e: any) {
            throw new Error(`Erreur lors du parsing XML: ${e.message}`);
        }
    }


    public GetSessionId(): string {
        return this.SessionId;
    }

    public GetIsAuthenticated(): boolean {
        return this.IsAuthenticated;
    }

    public ToSoapVar(): string
    {
        return `<sc xsi:type="ns1:BasSecurityContext"><SessionId xsi:type="xsd:string">${this.SessionId}</SessionId><IsAuthenticated xsi:type="xsd:boolean">${this.IsAuthenticated}</IsAuthenticated></sc>`
    }

    public Clean() {
        this.SessionId = "";
        this.IsAuthenticated = false;
    }

}
