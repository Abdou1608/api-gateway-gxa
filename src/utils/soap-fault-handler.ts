import { BasSoapFault, BasFaultInfo } from '../Model/BasSoapObject/BasSoapFault';
import { SoapServerError } from '../common/errors';

/**
 * Mapping des faultcode / state vers des statuts HTTP.
 * Guidelines d'ajustement:
 *  - Client/Sender => 405 (erreur d'appel / validation)
 *  - Server/Receiver => 502 (erreur côté service distant)
 *  - SOAP-ENV:<number> :
 *       * si faultstring contient 'session expired' => 440 (Login Timeout non standard, adapter à 401 si souhaité)
 *       * sinon 405 par défaut (on considère une erreur d'usage)
 *  - state (champ applicatif) peut raffiner (ex: state=0 pour session expirée -> 440/401)
 * Procédé d'extension:
 *  1. Observer logs [SOAP-FAULT] produits (faultcode, state) en environnement de test.
 *  2. Ajouter ici les valeurs fréquentes avec le statut choisi.
 *  3. Garder la règle de fallback 500 pour ne rien masquer.
 */
const FAULTCODE_HTTP_MAP: Record<string, number> = {
  client: 405,
  sender: 405,
  server: 502,
  receiver: 502,
  'soap-env:client': 405,
  'soap-env:server': 503,
  // Ajouts fréquents potentiels
  'soap:client': 405,
  'soap:server': 504,
  'env:client': 405,
  'env:server': 505,
};

/** Mapping optionnel d'états applicatifs BAS (state) -> HTTP. Ajuster selon la sémantique métier. */
const STATE_HTTP_MAP: Record<string, number> = {
  // '0': 440, // Session expirée potentielle
  // Ajouter d'autres mappings métier ici.
};

export interface NormalizedSoapFaultError {
  httpStatus: number;
  message: string;
  errorCode: string; // code applicatif interne
  fault: BasFaultInfo;
}

// Cache simple en mémoire des derniers faults (utilisé pour heuristique ex: session expirée)
interface CachedFault { code: string; at: number; fault: BasFaultInfo }
const LAST_FAULTS: CachedFault[] = [];
const MAX_FAULT_CACHE = 20;

function pushFault(code: string, fault: BasFaultInfo) {
  LAST_FAULTS.unshift({ code, at: Date.now(), fault });
  if (LAST_FAULTS.length > MAX_FAULT_CACHE) LAST_FAULTS.pop();
}

export function getLastFault(): CachedFault | undefined { return LAST_FAULTS[0]; }
export function wasRecentSessionExpiry(withinMs = 60_000): boolean {
  const limit = Date.now() - withinMs;
  return LAST_FAULTS.some(f => f.at >= limit && f.code === 'soap.sessionExpired');
}

/** Normalise un BasFaultInfo en (status, message). */
export function normalizeBasFault(fault: BasFaultInfo): NormalizedSoapFaultError {
  let status = 500;
  let errorCode = 'soap.fault';

  // 1. Mapping via faultcode
  if (fault.faultcode) {
    const key = fault.faultcode.toLowerCase();
    if (FAULTCODE_HTTP_MAP[key]) status = FAULTCODE_HTTP_MAP[key];
    // Cas numériques ou suffixes comme SOAP-ENV:20 => on peut décider 440 (session) si "expired" dans faultstring
    if (/^soap-env:\d+$/i.test(key)) {
      if (/session\s+expired/i.test(fault.faultstring || '')) {
        status = 440; // code non standard
        errorCode = 'soap.sessionExpired';
      } else status = 405;
    }
  }

  // 2. Mapping via state applicatif
  if (fault.state && STATE_HTTP_MAP[fault.state]) {
    status = STATE_HTTP_MAP[fault.state];
  }

  // Heuristique session expirée basée sur texte même sans faultcode numérique
  if (errorCode === 'soap.fault' && /session\s+expired/i.test(fault.faultstring || '')) {
    errorCode = 'soap.sessionExpired';
    if (status === 500) status = 440;
  }

  // 3. Heuristiques de message si non présent
  const message = fault.shortMessage || fault.faultstring || fault.reasonText || fault.details || 'SOAP Fault';

  const norm: NormalizedSoapFaultError = { httpStatus: status, message, errorCode, fault };
  pushFault(errorCode, fault);
  return norm;
}

/**
 * Handler central: prend une string SOAP; si fault => lève AppError.
 * Sinon renvoie la réponse originale (pour parsing futur).
 */
export function handleSoapResponse(rawXml: string, logger?: { debug: (...a: any[]) => void }): string {
  if (!rawXml) return rawXml;

  if (BasSoapFault.IsBasError(rawXml)) {
    const info = BasSoapFault.ParseBasErrorDetailed(rawXml);
    const norm = normalizeBasFault(info);
    if (logger) {
      try {
        logger.debug?.('[SOAP-FAULT]', { status: norm.httpStatus, faultcode: info.faultcode, state: info.state, msg: norm.message });
      } catch { /* ignore logging failure */ }
    }
    throw new SoapServerError(
      norm.errorCode,
      norm.message,
      { soapFault: { faultcode: info.faultcode, faultstring: info.faultstring, detail: info.details, state: info.state } }
    );
  }
  return rawXml;
}

/**
 * Exemple d'utilisation:
 * const xml = await soapClient.call(...);
 * const safe = handleSoapResponse(xml, logger);
 * // ensuite parser safe
 */
