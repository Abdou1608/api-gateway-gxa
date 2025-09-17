"use strict";
/* Logger minimal avec niveaux et désactivation en production selon variables d'env.
 * Utilisation: import logger from '../utils/logger'; logger.debug('x');
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ENABLE_DEBUG = /^(1|true|yes)$/i.test(process.env.DEBUG_SOAP_FAULTS || '');
function ts() { return new Date().toISOString(); }
function build() {
    const base = (level) => (msg, ...meta) => {
        if (level === 'debug' && !ENABLE_DEBUG)
            return;
        // Format simple JSON-friendly
        if (meta.length === 0 && typeof msg === 'object') {
            console.log(`[${ts()}] ${level.toUpperCase()}`, JSON.stringify(msg));
        }
        else {
            console.log(`[${ts()}] ${level.toUpperCase()}`, msg, ...meta);
        }
    };
    return {
        debug: base('debug'),
        info: base('info'),
        warn: base('warn'),
        error: base('error'),
    };
}
const logger = build();
exports.default = logger;
