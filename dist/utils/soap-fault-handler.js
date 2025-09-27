"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastFault = getLastFault;
exports.wasRecentSessionExpiry = wasRecentSessionExpiry;
exports.normalizeBasFault = normalizeBasFault;
exports.handleSoapResponse = handleSoapResponse;
const BasSoapFault_1 = require("../Model/BasSoapObject/BasSoapFault");
const errors_1 = require("../common/errors");
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
const FAULTCODE_HTTP_MAP = {
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
const STATE_HTTP_MAP = {
// '0': 440, // Session expirée potentielle
// Ajouter d'autres mappings métier ici.
};
const LAST_FAULTS = [];
const MAX_FAULT_CACHE = 20;
function pushFault(code, fault) {
    LAST_FAULTS.unshift({ code, at: Date.now(), fault });
    if (LAST_FAULTS.length > MAX_FAULT_CACHE)
        LAST_FAULTS.pop();
}
function getLastFault() { return LAST_FAULTS[0]; }
function wasRecentSessionExpiry(withinMs = 60_000) {
    const limit = Date.now() - withinMs;
    return LAST_FAULTS.some(f => f.at >= limit && f.code === 'soap.sessionExpired');
}
/** Normalise un BasFaultInfo en (status, message). */
function normalizeBasFault(fault) {
    let status = 500;
    let errorCode = 'soap.fault';
    // 1. Mapping via faultcode
    if (fault.faultcode) {
        const key = fault.faultcode.toLowerCase();
        if (FAULTCODE_HTTP_MAP[key])
            status = FAULTCODE_HTTP_MAP[key];
        // Cas numériques ou suffixes comme SOAP-ENV:20 => on peut décider 440 (session) si "expired" dans faultstring
        if (/^soap-env:\d+$/i.test(key)) {
            if (/session\s+expired/i.test(fault.faultstring || '')) {
                status = 440; // code non standard
                errorCode = 'soap.sessionExpired';
            }
            else
                status = 405;
        }
    }
    // 2. Mapping via state applicatif
    if (fault.state && STATE_HTTP_MAP[fault.state]) {
        status = STATE_HTTP_MAP[fault.state];
    }
    // Heuristique session expirée basée sur texte même sans faultcode numérique
    if (errorCode === 'soap.fault' && /session\s+expired/i.test(fault.faultstring || '')) {
        errorCode = 'soap.sessionExpired';
        if (status === 500)
            status = 440;
    }
    // 3. Heuristiques de message si non présent
    const message = fault.shortMessage || fault.faultstring || fault.reasonText || fault.details || 'SOAP Fault';
    const norm = { httpStatus: status, message, errorCode, fault };
    pushFault(errorCode, fault);
    return norm;
}
/**
 * Handler central: prend une string SOAP; si fault => lève AppError.
 * Sinon renvoie la réponse originale (pour parsing futur).
 */
function handleSoapResponse(rawXml, logger) {
    if (!rawXml)
        return rawXml;
    if (BasSoapFault_1.BasSoapFault.IsBasError(rawXml)) {
        const info = BasSoapFault_1.BasSoapFault.ParseBasErrorDetailed(rawXml);
        const norm = normalizeBasFault(info);
        if (logger) {
            try {
                logger.debug?.('[SOAP-FAULT]', { status: norm.httpStatus, faultcode: info.faultcode, state: info.state, msg: norm.message });
            }
            catch { /* ignore logging failure */ }
        }
        throw new errors_1.SoapServerError(norm.errorCode, norm.message, { soapFault: { faultcode: info.faultcode, faultstring: info.faultstring, detail: info.details, state: info.state } });
    }
    return rawXml;
}
/**
 * Exemple d'utilisation:
 * const xml = await soapClient.call(...);
 * const safe = handleSoapResponse(xml, logger);
 * // ensuite parser safe
 */
