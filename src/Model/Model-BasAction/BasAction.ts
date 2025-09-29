//import { HttpClient } from "@angular/common/http";
import { BasParams } from "../BasSoapObject/BasParams";
import { BasSecurityContext } from "../BasSoapObject/BasSecurityContext";
import { BasSoapClient } from "../Model-BasSoapClient/BasSoapClient";
import * as Xpath from "xpath";
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';
import { PendingQueue } from '../../utils/pending-queue';
import { observeSoapDuration, observeSoapDurationLabeled, recordQueueSize } from '../../observability/metrics';
import { SoapAudit } from '../../observability/soap-audit';
import { AppConfigService } from "../../services/AppConfigService/app-config.service";

export class BasAction {
public http = require('http');
    constructor(private BasSoapCLient: BasSoapClient,  private appConfigService: AppConfigService) { }

    public async RunAction(actionName: string, basParams: BasParams, basSecurityContext: BasSecurityContext, xmldata?:string, ctx?: { userId?: string; domain?: string; password?: string }): Promise<string> {
        let body = "<ns1:RunAction>" + basSecurityContext.ToSoapVar() + `<name xsi:type=\"xsd:string\">${actionName}</name>`;
        //console.log("Dans RunAction xmldata est :====="+xmldata) 
        basParams.AddStr("data", xmldata ?? "")
        body += basParams.ToSoapVar();
         //body +="<params>"+(xmldata ?? "")+"</params>"
        body += '</ns1:RunAction>'; 
       
             console.log("Body de la requete est:====="+body)
                                const p = PendingQueue.register(actionName, ctx);
                                await SoapAudit.init();
                                const auditStart = Date.now();
                                                logger.info(`[SOAP] ▶ RunAction ${actionName} owner=${ctx?.userId ?? '-'} domain=${ctx?.domain ?? '-'} queue=${PendingQueue.size()} [${PendingQueue.formatSnapshot()}]`);
                                                recordQueueSize(PendingQueue.size());
                                let response: string;
                                try {
                                    response = await this.BasSoapCLient.soapRequest(this.appConfigService.GetURlActionService(), body, ctx);
                                    const end = Date.now();
                                    // capture small payload snippet (strip whitespace, truncate)
                                    const snippet = (response || '').replace(/\s+/g,' ').slice(0, 800);
                                    SoapAudit.record({ id: p.id, action: actionName, owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'success', payloadSnippet: snippet });
                                } finally {
                                    const ended = PendingQueue.complete(p.id);
                                    if (ended) {
                                        const durMs = Date.now() - ended.startedAt;
                                                        const sec = durMs / 1000;
                                                        observeSoapDuration(actionName, sec);
                                                        observeSoapDurationLabeled(ctx?.userId, ctx?.domain, sec);
                                        logger.info(`[SOAP] ◀ RunAction ${actionName} done in ${durMs}ms owner=${ctx?.userId ?? '-'} domain=${ctx?.domain ?? '-'} queue=${PendingQueue.size()} [${PendingQueue.formatSnapshot()}]`);
                                                        recordQueueSize(PendingQueue.size());
                                    }
                                }
                // Centralisation fault -> handleSoapResponse (lèvera AppError si fault)
                try {
                    response = handleSoapResponse(response, logger);
                } catch (e: any) {
                    // Add audit record for error before rethrowing
                    const end = Date.now();
                    const errMsg = (e?.message || '').toString();
                    const errSnippet = errMsg.slice(0, 800);
                    SoapAudit.record({ id: p.id, action: actionName, owner: ctx?.userId, domain: ctx?.domain, start: auditStart, end, durationMs: end - auditStart, outcome: 'error', errorCode: e?.code || e?.name, errorMessage: e?.message, errorSnippet: errSnippet });
                    throw e;
                }
                return response;
    }

    public GetLogEntry(soapEnv: string): Array<string> {
        let result = new Array<string>();
        return  result;    
    }

    public GetDataFromSoapEnv(soapEnv: string): string {
        let XmlParser: DOMParser = new DOMParser();
        let XmlDoc: Document = XmlParser.parseFromString(soapEnv, 'application/xml');
        let XPathSelect: Xpath.XPathSelect = Xpath.useNamespaces(
            {
                "envlp": "http://schemas.xmlsoap.org/soap/envelope/",
                "lg": "http://belair-info.com/bas/services"
            }
        );
        let val: any = XPathSelect("//envlp:Envelope/envlp:Body/lg:BasActionResult/Data", XmlDoc);
        if ((val[0] as Node) !== undefined)
            return String((val[0] as Node).textContent);
        return "";
    }
}