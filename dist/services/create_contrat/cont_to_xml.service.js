"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contModelToXml = contModelToXml;
const xmlbuilder2_1 = require("xmlbuilder2");
// ====== Config ======
const MONETARY_FIELDS = new Set([
    'Primann', 'Totann', 'Franini', 'Capini', 'Coutpol', 'Cieprime', 'Cietaxes', 'Commsup', 'Commann', 'Txcomm',
    'Hono', 'Ptini', 'Pnini', 'Comini', 'Impaye', 'Acompte', 'Frprel', 'Tauxrea', 'Tauxap1', 'Tauxap2',
    'Retrorea', 'Retroap1', 'Retroap2', 'Kprretro', 'Kprretem', 'Retroemi', 'Coeffcom'
    // champs monétaires complémentaires (ex: pour devises) 
    // ajouter ici les autres champs monétaires
]);
// forcer une devise quand le champ compagnon "...1" est absent :
const DEFAULT_CURRENCY = "DJF";
// ====== Helpers ======
function formatFloatForBas(n) {
    // "3.00000000000000E+0004" style BAS
    const s = n.toExponential(14).toUpperCase(); // ex "3.50000000000000E+3"
    const m = s.match(/E([+-])(\d+)/);
    if (!m)
        return s;
    const sign = m[1];
    const exp = m[2].padStart(4, '0');
    return s.replace(/E[+-]\d+/, `E${sign}${exp}`);
}
function looksIsoDateTime(v) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v);
}
/**
 * Génère un <param ...> selon le type ET le nom du champ.
 */
function buildParamXml(name, value) {
    if (DATE_FIELDS.has(name)) {
        return buildDateParam(name, value);
    }
    // Null / undefined
    if (value === null || value === undefined) {
        return { '@name': name, '@type': 'ptUnknown', '@is_null': 'true' };
    }
    // Montants monétaires forçés en ptFloat (même si entier)
    if (MONETARY_FIELDS.has(name)) {
        const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
        if (!isFinite(num)) {
            // fallback string si non numérisable
            return { '@name': name, '@type': 'ptString', '#': String(value) };
        }
        return { '@name': name, '@type': 'ptFloat', '@float_val': formatFloatForBas(num) };
    }
    // Nombres
    if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return { '@name': name, '@type': 'ptInt', '@int_val': String(value) };
        }
        return { '@name': name, '@type': 'ptFloat', '@float_val': formatFloatForBas(value) };
    }
    // Booléens
    if (typeof value === 'boolean') {
        return { '@name': name, '@type': 'ptBool', '@bool_val': value ? 'true' : 'false' };
    }
    // Chaînes
    if (typeof value === 'string') {
        // si la chaîne ressemble déjà à une ISO complète, on peut aussi la sérialiser en ptDateTime
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return { '@name': name, '@type': 'ptDateTime', '@date_val': value.endsWith('.000') ? value : `${value}.000` };
        }
        if (value === '')
            return { '@name': name, '@type': 'ptString' };
        return { '@name': name, '@type': 'ptString', '#': value };
    }
    // Fallback
    return { '@name': name, '@type': 'ptString', '#': String(value) };
}
/**
 * Injecte la devise par défaut pour un champ monétaire s'il manque le compagnon "...1"
 * ex: Primann -> Primann1, Totann -> Totann1
 */
function ensureCurrencyCompanions(obj) {
    if (!DEFAULT_CURRENCY)
        return;
    for (const key of Object.keys(obj)) {
        if (MONETARY_FIELDS.has(key)) {
            const curKey = `${key}1`;
            if (!(curKey in obj)) {
                obj[curKey] = DEFAULT_CURRENCY; // ex "DJF"
            }
        }
    }
}
/**
 * Convertit un objet JS en <object typename="..."><param .../></object>
 */
function objectToXmlNode(typename, obj) {
    // optionnel : injecter devise défaut si nécessaire
    ensureCurrencyCompanions(obj);
    return {
        '@typename': typename,
        'param': Object.entries(obj).map(([key, value]) => buildParamXml(key, value)),
    };
}
/**
 * Produit <cont><input><objects><object .../><object .../></objects></input></cont>
 */
function contModelToXml(model) {
    const objectNodes = [];
    if (model?.CONT)
        objectNodes.push(objectToXmlNode('CONT', model.CONT));
    if (model?.PIEC)
        objectNodes.push(objectToXmlNode('PIEC', model.PIEC));
    if (model?.poli)
        objectNodes.push(objectToXmlNode('poli', model.poli));
    const root = {
        cont: {
            input: {
                objects: { object: objectNodes }
            }
        }
    };
    return (0, xmlbuilder2_1.create)({ version: '1.0' }).ele(root).end({ prettyPrint: true, headless: true });
}
// --- Ajoute ces helpers/config ---
const DATE_FIELDS = new Set([
    'Datdermo', 'Dateresi', 'Ddebpiec', 'Dfinpiec', 'Entree', 'Sortie',
    'Dateori', 'Datebia', 'Datetar', 'ext_piec_datesit', 'DateRefIndice', 'dateRefIndice' // complète si besoin
]);
function toIsoDateTime(value) {
    if (value === null || value === undefined || value === '')
        return null;
    // Date JS
    if (value instanceof Date && !isNaN(value.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}.000`;
    }
    const s = String(value).trim();
    // DD/MM/YYYY
    let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m)
        return `${m[3]}-${m[2]}-${m[1]}T00:00:00.000`;
    // YYYY-MM-DD
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m)
        return `${m[1]}-${m[2]}-${m[3]}T00:00:00.000`;
    // ISO complet déjà (YYYY-MM-DDTHH:mm:ss(.SSS)?)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?$/.test(s)) {
        return s.endsWith('.000') ? s : `${s.replace(/(\.\d{3})?$/, '.000')}`;
    }
    // Format non reconnu -> invalide pour cast
    return null;
}
function buildDateParam(name, value) {
    const iso = toIsoDateTime(value);
    if (!iso)
        return { '@name': name, '@type': 'ptUnknown', '@is_null': 'true' }; // évite le cast serveur
    return { '@name': name, '@type': 'ptDateTime', '@date_val': iso };
}
