"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskModelToXml = riskModelToXml;
exports.riskModelToEscapedStrVal = riskModelToEscapedStrVal;
// src/app/utils/risk-xml-serializer.ts
const xmlbuilder2_1 = require("xmlbuilder2");
/* ===================== Config ===================== */
const MONETARY_FIELDS = new Set([
    // hérités de cont + utiles côté risk/garan
    'Primann', 'Totann', 'Franini', 'Capini', 'Coutpol', 'Cieprime', 'Cietaxes', 'Commsup', 'Commann', 'Txcomm',
    'Hono', 'Ptini', 'Pnini', 'Comini', 'Impaye', 'Acompte', 'Frprel', 'Tauxrea', 'Tauxap1', 'Tauxap2',
    'Retrorea', 'Retroap1', 'Retroap2', 'Kprretro', 'Kprretem', 'Retroemi', 'Coeffcom', 'Crm',
    'Capital', 'Franchi', 'Valneuf', 'Valexp', 'Coef', 'Jourfran', 'Vindini', 'Vindice', 'Puissan', 'Pfiscale'
]);
const DEFAULT_CURRENCY = 'DJF';
const DATE_FIELDS = new Set([
    // RISA
    'Dateori', 'Datetar', 'Datebia',
    // RVEH
    'Datecg', 'Datecirc', 'Dateach', 'Datecrm', 'Dateprtr', 'Datdertr',
    // GARAN
    'Prieff',
    // génériques
    'Entree', 'Sortie'
]);
/* ===================== Helpers ===================== */
function formatFloatForBas(n) {
    const s = Number(n).toExponential(14).toUpperCase(); // "3.50000000000000E+3"
    const m = s.match(/E([+-])(\d+)/);
    if (!m)
        return s;
    const sign = m[1];
    const exp = m[2].padStart(4, '0'); // "E+0003"
    return s.replace(/E[+-]\d+/, `E${sign}${exp}`);
}
function toIsoDateTime(value) {
    if (value === null || value === undefined || value === '')
        return null;
    if (value instanceof Date && !isNaN(value.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}.000`;
    }
    const s = String(value).trim();
    let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // DD/MM/YYYY
    if (m)
        return `${m[3]}-${m[2]}-${m[1]}T00:00:00.000`;
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/); // YYYY-MM-DD
    if (m)
        return `${m[1]}-${m[2]}-${m[3]}T00:00:00.000`;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+\-]\d{2}:\d{2})?$/.test(s)) {
        return s.includes('.') ? s : s.replace(/Z?$/, '.000');
    }
    return null;
}
function ensureCurrencyCompanions(obj) {
    if (!DEFAULT_CURRENCY)
        return;
    for (const key of Object.keys(obj)) {
        if (MONETARY_FIELDS.has(key)) {
            const curKey = `${key}1`;
            if (!(curKey in obj))
                obj[curKey] = DEFAULT_CURRENCY; // e.g. "DJF"
        }
    }
}
function buildDateParam(name, value) {
    const iso = toIsoDateTime(value);
    if (!iso)
        return { '@name': name, '@type': 'ptUnknown', '@is_null': 'true' };
    return { '@name': name, '@type': 'ptDateTime', '@date_val': iso };
}
function buildParamXml(name, value) {
    if (DATE_FIELDS.has(name))
        return buildDateParam(name, value);
    if (value === null || value === undefined) {
        return { '@name': name, '@type': 'ptUnknown', '@is_null': 'true' };
    }
    if (MONETARY_FIELDS.has(name)) {
        const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
        if (!isFinite(num))
            return { '@name': name, '@type': 'ptString', '#': String(value) };
        return { '@name': name, '@type': 'ptFloat', '@float_val': formatFloatForBas(num) };
    }
    if (typeof value === 'number') {
        return Number.isInteger(value)
            ? { '@name': name, '@type': 'ptInt', '@int_val': String(value) }
            : { '@name': name, '@type': 'ptFloat', '@float_val': formatFloatForBas(value) };
    }
    if (typeof value === 'boolean') {
        return { '@name': name, '@type': 'ptBool', '@bool_val': value ? 'true' : 'false' };
    }
    if (typeof value === 'string') {
        const isoMaybe = toIsoDateTime(value);
        if (isoMaybe)
            return { '@name': name, '@type': 'ptDateTime', '@date_val': isoMaybe };
        return value === '' ? { '@name': name, '@type': 'ptString' } : { '@name': name, '@type': 'ptString', '#': value };
    }
    return { '@name': name, '@type': 'ptString', '#': String(value) };
}
function objectToXmlNode(typename, obj) {
    ensureCurrencyCompanions(obj);
    return { '@typename': typename, param: Object.entries(obj).map(([k, v]) => buildParamXml(k, v)) };
}
/* ===================== Serializer principal ===================== */
/**
 * Transforme { adh, Risa, Rveh, garan[] } en
 * <risk><input><objects>
 *   <object typename="ADH">...</object>
 *   <object typename="RISA">...</object>
 *   <object typename="RVEH">...</object>
 *   <objects typename="GARAN">
 *     <object typename="GARAN">...</object>
 *     <object typename="GARAN">...</object>
 *   </objects>
 * </objects></input></risk>
 */
function riskModelToXml(model, rootName = 'risk' // <-- racine par défaut "risk"
) {
    const simpleObjects = [];
    const adhObj = model.ADH ?? model.adh;
    const risaObj = model.RISA ?? model.Risa;
    const rvehObj = model.RVEH ?? model.Rveh;
    const garans = (model.GARAN ?? model.garan) ?? [];
    if (adhObj)
        simpleObjects.push(objectToXmlNode('ADH', adhObj));
    if (risaObj)
        simpleObjects.push(objectToXmlNode('RISA', risaObj));
    if (rvehObj)
        simpleObjects.push(objectToXmlNode('RVEH', rvehObj));
    // Groupe GARAN
    let grouped = null;
    if (Array.isArray(garans) && garans.length > 0) {
        grouped = {
            '@typename': 'GARANT',
            object: garans.map(g => objectToXmlNode('GARAN', g))
        };
    }
    const root = {
        [rootName]: {
            input: {
                objects: {
                    ...(simpleObjects.length ? { object: simpleObjects } : {}),
                    ...(grouped ? { objects: grouped } : {})
                }
            }
        }
    };
    return (0, xmlbuilder2_1.create)({ version: '1.0' }).ele(root).end({ prettyPrint: true, headless: true });
}
/** Version échappée pour insertion dans StrVal */
function riskModelToEscapedStrVal(model, rootName = 'risk') {
    const xml = riskModelToXml(model, rootName);
    return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
