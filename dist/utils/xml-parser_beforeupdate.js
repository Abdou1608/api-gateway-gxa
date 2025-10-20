"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXml = parseXml;
exports.objectToXML = objectToXML;
exports.objectToCustomXML = objectToCustomXML;
exports.xmlToEscapedForStrVal = xmlToEscapedForStrVal;
exports.objectToCustomXMLForStrVal = objectToCustomXMLForStrVal;
exports.parseTabsXml = parseTabsXml;
const fast_xml_parser_1 = require("fast-xml-parser");
const xml2js_1 = require("xml2js");
const xmlbuilder2_1 = require("xmlbuilder2");
const tab_model_1 = require("../Model/tab.model");
async function parseXml(xml) {
    return await (0, xml2js_1.parseStringPromise)(xml, { explicitArray: false });
}
/**
 * Transforme un objet JavaScript en flux XML enveloppé dans une balise <Data>,
 * sans inclure la déclaration XML.
 *
 * @param data - L'objet contenant plusieurs sous-objets à convertir en XML.
 * @returns Un flux XML sous forme de chaîne de caractères.
 */
function objectToXML(data, _root) {
    const root = (0, xmlbuilder2_1.create)().ele(_root).ele('input').ele('objects');
    function buildXml(parent, obj) {
        Object.entries(obj).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                parent.ele('param').att('xsi:nil', 'true').att('name', key).att('is_null', "true").att('type', 'ptUnknown');
            }
            else if (Array.isArray(value)) {
                const arrayParent = parent.ele('object').att('typename', key);
                value.forEach((item) => {
                    const itemElem = arrayParent.ele('item');
                    if (typeof item === 'object') {
                        buildXml(itemElem, item);
                    }
                    else {
                        itemElem.txt(String(item));
                    }
                });
            }
            else if (typeof value === 'object') {
                const child = parent.ele('object').att('typename', key);
                ;
                buildXml(child, value);
            }
            else if (typeof value === 'boolean') {
                parent.ele('param').att('name', key).att('type', 'ptBool').att('bool_val', value ? 'true' : 'false').txt(value ? 'true' : 'false');
            }
            else if (typeof value === 'number') {
                parent.ele('param').att('name', key).att('type', Number.isInteger(value) ? 'ptInt' : 'ptfloat').att('int_val', String(value)).txt(String(value));
            }
            else {
                parent.ele('param').att('name', key).att('type', 'ptString').txt(value);
            }
        });
    }
    buildXml(root, data);
    return root.end({ prettyPrint: true, headless: true });
}
/**
  *
 * @param data - Objet source contenant des sous-objets avec des paramètres typés.
 * @returns Chaîne XML.
 */
//import { create } from 'xmlbuilder2';
/** Détection prudente d’une date ISO (yyyy-MM-dd, yyyy-MM-ddTHH:mm:ss[.SSS]Z, etc.) */
function isIsoDateString(s) {
    if (!s)
        return false;
    const isoLike = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+\-]\d{2}:\d{2})?)?$/;
    if (!isoLike.test(s))
        return false;
    const d = new Date(s);
    return !isNaN(+d);
}
/** Mapping JS -> (type, attributs, texte) pour la grammaire attendue (ptString, ptInt, …). */
function getXMLTypeAndValue(value) {
    if (value === null || value === undefined) {
        return { type: 'ptUnknown', attrs: { is_null: 'true' } };
    }
    switch (typeof value) {
        case 'boolean':
            return { type: 'ptBool', attrs: { bool_val: String(value) } };
        case 'number':
            if (Number.isInteger(value))
                return { type: 'ptInt', attrs: { int_val: String(value) } };
            return { type: 'ptFloat', attrs: { float_val: value.toExponential(14).replace('e', 'E') } };
        case 'string': {
            if (isIsoDateString(value)) {
                const iso = new Date(value).toISOString();
                return { type: 'ptDateTime', attrs: { date_val: iso } };
            }
            return { type: 'ptString', attrs: {}, text: value };
        }
        default:
            return { type: 'ptUnknown', attrs: { is_null: 'true' } };
    }
}
/** Ajoute un <object typename="..."> avec ses <param> dans <objects>. */
function appendObject(objectsEle, objectName, objectData) {
    const objectEle = objectsEle.ele('object').att('typename', String(objectName).toUpperCase());
    if (Array.isArray(objectData)) {
        // Chaque entrée du tableau devient un param indexé
        objectData.forEach((val, idx) => {
            const { type, attrs, text } = getXMLTypeAndValue(val);
            const p = objectEle.ele('param').att('name', `${objectName}[${idx}]`).att('type', type);
            for (const [k, v] of Object.entries(attrs))
                p.att(k, v);
            if (text !== undefined && type === 'ptString')
                p.txt(text);
        });
        return;
    }
    if (objectData && typeof objectData === 'object') {
        for (const paramName of Object.keys(objectData)) {
            const { type, attrs, text } = getXMLTypeAndValue(objectData[paramName]);
            const p = objectEle.ele('param').att('name', String(paramName)).att('type', type);
            for (const [k, v] of Object.entries(attrs))
                p.att(k, v);
            if (text !== undefined && type === 'ptString')
                p.txt(text);
        }
        return;
    }
    // Valeur atomique directement sous l'objet
    const { type, attrs, text } = getXMLTypeAndValue(objectData);
    const p = objectEle.ele('param').att('name', String(objectName)).att('type', type);
    for (const [k, v] of Object.entries(attrs))
        p.att(k, v);
    if (text !== undefined && type === 'ptString')
        p.txt(text);
}
/**
 * Génère un XML propre de la forme:
 *   <data><input><objects> ... </objects></input></data>
 */
function objectToCustomXML(data, sid) {
    const root = (0, xmlbuilder2_1.create)().ele(sid);
    const input = root.ele('input');
    const objects = input.ele('objects');
    for (const objectName of Object.keys(data)) {
        appendObject(objects, objectName, data[objectName]);
    }
    return root.end({ prettyPrint: true, headless: true });
}
/**
 * Échappe le XML pour insertion dans un champ string (StrVal) d’un SOAP :
 *   & -> &amp;  (d’abord)
 *   < -> &lt;
 *   > -> &gt;
 */
function xmlToEscapedForStrVal(xml) {
    return xml
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
/** Helper : produit directement la version échappée pour StrVal. */
function objectToCustomXMLForStrVal(data, sid) {
    return xmlToEscapedForStrVal(objectToCustomXML(data, sid));
}
// On suppose que ces types existent déjà dans ton code :
/*
export enum FieldsTagName { Tabaff='Tabaff', Tabcode='Tabcode', Tabref='Tabref', Tabval='Tabval', Valref='Valref' }
export interface TabRecord { Tabaff:string; Tabcode:string; Tabref:string; Tabval:string; Valref:string; }
export interface TabMeta { tabcode:string; type:string; align:string; size:number; }
export interface TabsModel { meta: TabMeta; records: TabRecord[]; }
*/
function toArray(x) {
    if (x == null)
        return [];
    return Array.isArray(x) ? x : [x];
}
function parseTabsXml(xmlRaw) {
    // 1) Nettoyage : retire les préfixes comme "Script result:" / BOM / espaces
    const decoded = xmlRaw
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\\</g, '<')
        .replace(/\\>/g, '>')
        .replace(/\\\//g, '/')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<');
    // 2) Parser configuré (texte dans "#text" quand il y a des attributs)
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        trimValues: true,
    });
    const doc = parser.parse(decoded);
    // 3) Récupération du premier <tab>
    const tabsNode = doc?.tabs?.tab;
    const tabs = toArray(tabsNode);
    if (tabs.length === 0) {
        throw new Error('XML invalide: élément <tab> introuvable.');
    }
    const tab0 = tabs[0];
    // 4) Métadonnées <tab ...>
    const meta = {
        tabcode: String(tab0?.['@_tabcode'] ?? ''),
        type: String(tab0?.['@_type'] ?? ''),
        align: String(tab0?.['@_align'] ?? ''),
        size: Number(tab0?.['@_size'] ?? 0),
    };
    // 5) Liste d'objets <object typename="tab"> et leurs <param>
    const objects = toArray(tab0?.objects?.object);
    const records = objects
        .filter((o) => String(o?.['@_typename'] ?? '').toLowerCase() === 'tab')
        .map((o) => {
        const params = toArray(o?.param);
        // Réduit la liste de <param> en dictionnaire { name: value }
        const bag = params.reduce((acc, p) => {
            const key = String(p?.['@_name'] ?? '');
            // valeur textuelle : fast-xml-parser met le texte dans "#text" s'il y a des attributs
            let val = '';
            if (typeof p?.['#text'] === 'string')
                val = p['#text'];
            else if (typeof p?._ === 'string')
                val = p._; // fallback
            else if (typeof p === 'string')
                val = p; // cas rarissime
            if (key)
                acc[key] = val;
            return acc;
        }, {});
        // Construit l'enregistrement typé
        const rec = {
            [tab_model_1.FieldsTagName.Tabaff]: bag[tab_model_1.FieldsTagName.Tabaff] ?? '',
            [tab_model_1.FieldsTagName.Tabcode]: bag[tab_model_1.FieldsTagName.Tabcode] ?? '',
            [tab_model_1.FieldsTagName.Tabref]: bag[tab_model_1.FieldsTagName.Tabref] ?? '',
            [tab_model_1.FieldsTagName.Tabval]: bag[tab_model_1.FieldsTagName.Tabval] ?? '',
            [tab_model_1.FieldsTagName.Valref]: bag[tab_model_1.FieldsTagName.Valref] ?? '',
        };
        return rec;
    });
    return { meta, records };
}
