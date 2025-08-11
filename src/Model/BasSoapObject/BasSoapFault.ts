import * as Xpath from 'xpath';
import { DOMParser } from '@xmldom/xmldom';

export class BasSoapFault {
  public static ThrowError(soapEnv: string): never {
    const msg = this.IsBasError(soapEnv) ? this.ParseBasError(soapEnv) : soapEnv;
    throw new Error(msg);
  }

  public static IsBasError(soapEnv: string): boolean {
    if (!soapEnv) return false;

    try {
      // IMPORTANT: ne pas passer d'options ici (évite TS2322/TS2353)
      const doc = new DOMParser().parseFromString(soapEnv, 'text/xml');

      // Détection principale : <Envelope>/<Body>/<Fault> (agnostique aux préfixes)
      const faultNodes = Xpath.select(
        '//*[local-name()="Envelope"]/*[local-name()="Body"]/*[local-name()="Fault"]',
        doc as unknown as any
      ) as any[];

      if (faultNodes && faultNodes.length > 0) return true;

      // Indices secondaires : faultcode/faultstring
      const hintCount =
        (Xpath.select('//*[local-name()="faultcode"]', doc as any) as any[]).length +
        (Xpath.select('//*[local-name()="faultstring"]', doc as any) as any[]).length;

      return hintCount > 0;
    } catch {
      // XML mal formé : dernier filet par regex
      return /<([A-Za-z0-9\-_]+:)?Fault\b/i.test(soapEnv);
    }
  }

  public static ParseBasError(soapEnv: string): string {
    try {
      const doc = new DOMParser().parseFromString(soapEnv, 'text/xml');

      // 1) SOAP 1.1: <faultstring>
      const faultString = Xpath.select(
        'string(//*[local-name()="Fault"]/*[local-name()="faultstring"])',
        doc as unknown as any
      ) as string;
      if (faultString && String(faultString).trim().length > 0) {
        return String(faultString).trim();
      }

      // 2) SOAP 1.2: <Reason>/<Text>
      const reasonText = Xpath.select(
        'string(//*[local-name()="Fault"]/*[local-name()="Reason"]/*[local-name()="Text"])',
        doc as unknown as any
      ) as string;
      if (reasonText && String(reasonText).trim().length > 0) {
        return String(reasonText).trim();
      }

      // 3) Détail applicatif: .../detail/.../Details
      const details = Xpath.select(
        'string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="Details"])',
        doc as unknown as any
      ) as string;
      if (details && String(details).trim().length > 0) {
        return String(details).trim();
      }

      // 4) Fallback: texte du noeud Fault
      const faultTextNode = Xpath.select(
        'string(//*[local-name()="Fault"])',
        doc as unknown as any
      ) as string;
      if (faultTextNode && String(faultTextNode).trim().length > 0) {
        return String(faultTextNode).trim();
      }

      // Si rien trouvé, renvoyer le XML brut
      return soapEnv;
    } catch {
      return soapEnv;
    }
  }
}
