import * as Xpath from 'xpath';
import { DOMParser } from '@xmldom/xmldom';

/**
 * Structure enrichie d'une faute SOAP.
 */
export interface BasFaultInfo {
  faultcode?: string;
  faultstring?: string;
  reasonText?: string;
  details?: string;
  state?: string;
  raw?: string;          // XML original (nettoyé)
  shortMessage: string;  // Message court synthétisé
}

/** Utilitaire: décodage minimal des entités les plus courantes. */
function decodeXmlEntities(input: string): string {
  return input
    .replace(/^\s+|\s+$/g, '')
    .replace(/^"|"$/g, '') // enlève guillemets englobants éventuels
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Extraction manuelle via RegExp quand XPath échoue (XML cassé ou partiel). */
function regexExtract(tag: string, xml: string): string | undefined {
  const r = new RegExp(`<([A-Za-z0-9_-]+:)?${tag}[^>]*>([\s\S]*?)<\\/([A-Za-z0-9_-]+:)?${tag}>`, 'i');
  const m = r.exec(xml);
  if (m && m[2]) return m[2].trim();
  return undefined;
}

export class BasSoapFault {
  /**
   * Lance toujours une erreur enrichie si le XML représente une faute SOAP.
   */
  public static ThrowError(soapEnv: string): never {
    const cleaned = decodeXmlEntities(soapEnv || '');
    if (this.IsBasError(cleaned)) {
      const fault = this.ParseBasErrorDetailed(cleaned);
      throw new Error(fault.shortMessage);
    }
    throw new Error(cleaned);
  }

  /**
   * Détermine si le contenu ressemble à une faute SOAP (robuste: XPath + regex fallback).
   */
  public static IsBasError(soapEnv: string): boolean {
    if (!soapEnv) return false;
    const xml = decodeXmlEntities(soapEnv);

    // Heuristique rapide regex
    if (/<([A-Za-z0-9\-_]+:)?Fault\b/i.test(xml)) return true;

    try {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const faultNodes = Xpath.select(
        '//*[local-name()="Envelope"]/*[local-name()="Body"]/*[local-name()="Fault"]',
        doc as any
      ) as any[];
      if (faultNodes?.length) return true;

      const indicators =
        (Xpath.select('//*[local-name()="faultcode"]', doc as any) as any[]).length +
        (Xpath.select('//*[local-name()="faultstring"]', doc as any) as any[]).length +
        (Xpath.select('//*[local-name()="Reason"]', doc as any) as any[]).length;
      return indicators > 0;
    } catch {
      // Si parsing DOM impossible mais regex plus haut a échoué, considérer non-fault.
      return false;
    }
  }

  /** Version existante conservée pour rétro-compat : renvoie un message string. */
  public static ParseBasError(soapEnv: string): string {
    return this.ParseBasErrorDetailed(soapEnv).shortMessage;
  }

  /** Nouvelle version: renvoie la structure détaillée BasFaultInfo. */
  public static ParseBasErrorDetailed(soapEnv: string): BasFaultInfo {
    const xml = decodeXmlEntities(soapEnv);
    const fault: BasFaultInfo = { shortMessage: 'SOAP Fault', raw: xml };

    try {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');

      const faultcode = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="faultcode"])', doc as any) as string;
      if (faultcode && faultcode.trim()) fault.faultcode = faultcode.trim();

      const faultstring = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="faultstring"])', doc as any) as string;
      if (faultstring && faultstring.trim()) fault.faultstring = faultstring.trim();

      const reasonText = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="Reason"]/*[local-name()="Text"])', doc as any) as string;
      if (reasonText && reasonText.trim()) fault.reasonText = reasonText.trim();

      const details = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="Details"])', doc as any) as string;
      if (details && details.trim()) fault.details = details.trim();

      // State spécifique (exemple EBasRemotableException/State)
      const state = Xpath.select('string(//*[local-name()="Fault"]/*[local-name()="detail"]//*[local-name()="State"])', doc as any) as string;
      if (state && state.trim()) fault.state = state.trim();
    } catch {
      // Ignoré: on utilisera extraction regex dessous si nécessaire.
    }

    // Fallbacks regex si certains champs manquent
    if (!fault.faultcode) fault.faultcode = regexExtract('faultcode', xml);
    if (!fault.faultstring) fault.faultstring = regexExtract('faultstring', xml);
    if (!fault.details) fault.details = regexExtract('Details', xml);
    if (!fault.state) fault.state = regexExtract('State', xml);

    // Construction du message court priorisant faultstring puis reason
    const parts: string[] = [];
    if (fault.faultcode) parts.push(`[${fault.faultcode}]`);
    if (fault.faultstring) parts.push(fault.faultstring);
    else if (fault.reasonText) parts.push(fault.reasonText);
    else if (fault.details) parts.push(fault.details);
    fault.shortMessage = parts.length ? parts.join(' ') : 'SOAP Fault';

    return fault;
  }
}
