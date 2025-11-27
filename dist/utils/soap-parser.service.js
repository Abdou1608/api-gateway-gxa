"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSoapXmlToJson = parseSoapXmlToJson;
exports.xmlToJsonSync = xmlToJsonSync;
exports.parseObjectXmlToJson = parseObjectXmlToJson;
exports.new_parseSoapXmlToJson = new_parseSoapXmlToJson;
exports.new_parseObjectXmlToJson = new_parseObjectXmlToJson;
exports.parseProdSoapResponse = parseProdSoapResponse;
exports.parse_Produit_SoapXml = parse_Produit_SoapXml;
exports.parseTabRowsXml = parseTabRowsXml;
exports.parseSoapEmbeddedXmlToJson = parseSoapEmbeddedXmlToJson;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fast_xml_parser_1 = require("fast-xml-parser");
const xmldom_1 = require("xmldom");
const xml2js_1 = require("xml2js");
const FAST_ATTR_PREFIX = '@_';
const fastParser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: FAST_ATTR_PREFIX,
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    allowBooleanAttributes: true,
});
/* ------------------------------ Helpers ------------------------------ */
const isTrue = (v) => v === true || v === 'true' || v === '1' || v === 1;
const toInt = (v) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
};
/** Conversion robuste des floats (gère E+0002, virgules, espaces) */
const toFloatStrict = (v) => {
    if (v === null || v === undefined)
        return null;
    if (typeof v === 'number')
        return Number.isFinite(v) ? v : null;
    let s = String(v).trim();
    if (!s)
        return null;
    // Remplacer virgule décimale éventuelle
    s = s.replace(',', '.');
    // Normaliser exposants de type E+0002 / E-0002 -> E+2 / E-2
    s = s.replace(/e([+-])0+(\d+)/i, 'e$1$2');
    // Supprimer espaces résiduels autour de E
    s = s.replace(/\s*e\s*/i, 'e');
    // Conversion
    const n = Number(s);
    if (Number.isFinite(n))
        return n;
    const n2 = parseFloat(s);
    return Number.isFinite(n2) ? n2 : null;
};
const toStringSafe = (v) => v === null || v === undefined ? '' : String(v).trim();
const pickAttrFast = (obj, name) => {
    // Cherche successivement @_<name>, name, lower/upper variants
    const k1 = `${FAST_ATTR_PREFIX}${name}`;
    if (obj && Object.prototype.hasOwnProperty.call(obj, k1))
        return obj[k1];
    if (obj && Object.prototype.hasOwnProperty.call(obj, name))
        return obj[name];
    const low = name.toLowerCase();
    const up = name.toUpperCase();
    if (obj && Object.prototype.hasOwnProperty.call(obj, low))
        return obj[low];
    if (obj && Object.prototype.hasOwnProperty.call(obj, up))
        return obj[up];
    return undefined;
};
const isStringType = (t) => {
    const v = typeof t === 'string' ? t.trim().toLowerCase() : '';
    return v === 'ptstring' || v === 'string';
};
const extractParamValueFast = (param) => {
    const name = pickAttrFast(param, 'name');
    const isNull = pickAttrFast(param, 'is_null');
    if (isTrue(isNull))
        return { name, value: null };
    const typeAttr = pickAttrFast(param, 'type');
    // 0) Si le type est string => toujours renvoyer le contenu textuel (même s'il ressemble à un nombre)
    if (isStringType(typeAttr)) {
        // fast-xml-parser place le texte sous '#text' (et peut déjà avoir parsé en number/bool)
        const textAny = (param && Object.prototype.hasOwnProperty.call(param, '#text'))
            ? param['#text']
            : undefined;
        if (textAny !== undefined && textAny !== null) {
            return { name, value: toStringSafe(textAny) };
        }
        // fallback ultime : si un des *_val existe on le convertit en string
        const candidates = [
            pickAttrFast(param, 'date_val'),
            pickAttrFast(param, 'datetime_val'),
            pickAttrFast(param, 'time_val'),
            pickAttrFast(param, 'int_val'),
            pickAttrFast(param, 'float_val'),
            pickAttrFast(param, 'bool_val'),
        ];
        const first = candidates.find(v => v !== undefined && v !== null && String(v).trim() !== '');
        if (first !== undefined)
            return { name, value: toStringSafe(first) };
        // sinon string vide (valeur présente mais vide)
        return { name, value: '' };
    }
    // 1) Dates (prioritaire si présentes en attributs)
    const dateCandidates = ['date_val', 'datetime_val', 'time_val', 'date', 'datetime'];
    for (const key of dateCandidates) {
        const val = pickAttrFast(param, key);
        if (val !== undefined && val !== null && String(val).trim() !== '') {
            return { name, value: String(val).trim() };
        }
    }
    // 2) Numériques / booléens
    const intVal = pickAttrFast(param, 'int_val');
    if (intVal !== undefined)
        return { name, value: toInt(intVal) };
    const floatVal = pickAttrFast(param, 'float_val');
    if (floatVal !== undefined)
        return { name, value: toFloatStrict(floatVal) };
    const boolVal = pickAttrFast(param, 'bool_val');
    if (boolVal !== undefined)
        return { name, value: isTrue(boolVal) };
    // 3) Contenu textuel (#text) — accepter string/number/bool
    if (param && Object.prototype.hasOwnProperty.call(param, '#text')) {
        const raw = param['#text'];
        // Si pas de type explicite, on renvoie "tel quel" (string/number/bool), mais trim si string
        return { name, value: typeof raw === 'string' ? raw.trim() : raw };
    }
    // 4) fallback vide
    return { name, value: '' };
};
const extractParamValueFromElement = (paramEl) => {
    const name = paramEl.getAttribute('name');
    const isNull = paramEl.getAttribute('is_null');
    if (isTrue(isNull))
        return { name, value: null };
    const typeAttr = paramEl.getAttribute('type');
    // Si type string => toujours le texte (même si "3021190")
    if (isStringType(typeAttr)) {
        return { name, value: toStringSafe(paramEl.textContent) };
    }
    // 1) Dates
    const dateAttr = paramEl.getAttribute('date_val') ??
        paramEl.getAttribute('datetime_val') ??
        paramEl.getAttribute('time_val') ??
        paramEl.getAttribute('date') ??
        paramEl.getAttribute('datetime');
    if (dateAttr && dateAttr.trim() !== '') {
        return { name, value: dateAttr.trim() };
    }
    // 2) Numériques / booléens
    const intVal = paramEl.getAttribute('int_val');
    if (intVal !== null && intVal !== undefined)
        return { name, value: toInt(intVal) };
    const floatVal = paramEl.getAttribute('float_val');
    if (floatVal !== null && floatVal !== undefined)
        return { name, value: toFloatStrict(floatVal) };
    const boolVal = paramEl.getAttribute('bool_val');
    if (boolVal !== null && boolVal !== undefined)
        return { name, value: isTrue(boolVal) };
    // 3) Texte (accepter tout)
    return { name, value: toStringSafe(paramEl.textContent) };
};
/* ------------------------------ parseSoapXmlToJson ------------------------------ */
/** Parse une réponse SOAP XML contenant un champ <Data> encodé. */
async function parseSoapXmlToJson(soapXml, datanode) {
    try {
        const dom = new xmldom_1.DOMParser();
        const serializer = new xmldom_1.XMLSerializer();
        const doc = dom.parseFromString(soapXml, 'application/xml');
        let dname = datanode ? `${datanode}-rows` : '';
        if (datanode === 'tab')
            dname = 'tab-rows';
        else if (datanode === 'tabs')
            dname = 'tabs';
        else if (datanode === 'risks' || datanode === 'Risks')
            dname = 'risks';
        else if (['offers', 'projects', 'Offers', 'Projects', 'offer', 'project'].includes(datanode ?? ''))
            dname = 'offers';
        let dataNode = doc.getElementsByTagName(datanode || 'Data' || 'data' || dname)[0];
        dataNode = dataNode ? dataNode : doc.getElementsByTagName('Data')[0];
        if (!dataNode || !dataNode.textContent) {
            dataNode = doc.getElementsByTagName(dname)[0];
        }
        const decoded = soapXml
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\\</g, '<')
            .replace(/\\>/g, '>')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        const innerXml = dom.parseFromString(decoded, 'application/xml');
        const root = innerXml.documentElement;
        let isList = false;
        if (datanode && datanode !== '') {
            const nodes = root.getElementsByTagName(dname || datanode || 'Data');
            const node = nodes[0];
            isList = node ? node.nodeName?.toLowerCase().endsWith('s') : false;
        }
        else {
            isList = root.tagName.toLowerCase().endsWith('s');
        }
        const tagname = datanode ? datanode : '';
        const rawnode = root.getElementsByTagName('object');
        const _rawnode = root.getElementsByTagName(tagname);
        const __rawnode = root.getElementsByTagName(`${tagname}-rows`);
        const ___rawnode = root.getElementsByTagName('Data');
        let rawNodes = rawnode.length > 0 ? rawnode : __rawnode;
        rawNodes = rawNodes.length > 0 ? rawNodes : _rawnode;
        rawNodes = rawNodes.length > 0 ? rawNodes : ___rawnode;
        // Plusieurs objets
        if (isList || rawNodes.length > 0) {
            const objectNodes = Array.from(rawNodes);
            if (objectNodes.length === 0) {
                throw new Error(`Aucun élément <object> trouvé dans le XML et Datanode=${datanode}`);
            }
            const results = objectNodes.map(node => {
                const xmlString = serializer.serializeToString(node);
                return parseObjectXmlToJson(xmlString);
            });
            return (results.length > 1 ? results : results[0]);
        }
        else {
            const xmlString = new xmldom_1.XMLSerializer().serializeToString(rawNodes[0]);
            const result = await parseSoapEmbeddedXmlToJson(xmlString);
            return result;
        }
    }
    catch (error) {
        throw new Error(error?.message ?? 'parseSoapXmlToJson failed');
    }
}
/* ------------------------------ xmlToJsonSync ------------------------------ */
function xmlToJsonSync(xml) {
    let output = {};
    const parser = new xml2js_1.Parser({
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
        valueProcessors: [
            // laisse xml2js typer les nombres, mais ce parseur est un fallback ; la voie principale gère ptString correctement
            (value) => (!isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value),
        ],
    });
    parser.parseString(xml, (err, result) => {
        if (err)
            throw err;
        output = extractFirstDataChild(result);
    });
    return output;
}
/** Renvoie le premier objet-fils du root (ignore les attributs racine) */
function extractFirstDataChild(obj) {
    if (typeof obj !== 'object' || obj === null)
        return obj;
    const keys = Object.keys(obj).filter((k) => !k.startsWith('xmlns') && !k.startsWith('xsi') && k !== '$');
    for (const k of keys) {
        if (typeof obj[k] === 'object')
            return obj[k];
    }
    if (keys.length)
        return obj[keys[0]];
    return obj;
}
/** Si le root a un seul noeud, on l'aplatit (ex: {data: {...}} => {...}) */
function flattenRoot(obj) {
    if (typeof obj === 'object' &&
        obj !== null &&
        Object.keys(obj).length === 1 &&
        typeof obj[Object.keys(obj)[0]] === 'object') {
        return obj[Object.keys(obj)[0]];
    }
    return obj;
}
function parseObjectXmlToJson(xml) {
    const result = fastParser.parse(xml);
    if (!result || !result.object || !result.object.param) {
        // Fallback : ancienne logique
        return xmlToJsonSync(xml);
    }
    const params = Array.isArray(result.object.param)
        ? result.object.param
        : [result.object.param];
    const output = {};
    for (const p of params) {
        const { name, value } = extractParamValueFast(p);
        if (name)
            output[name] = value;
    }
    // typename (si présent)
    const tn = pickAttrFast(result.object, 'typename');
    if (tn)
        output.typename = tn;
    return output;
}
function new_parseSoapXmlToJson(soapXml, datanode) {
    const dom = new xmldom_1.DOMParser();
    const doc = dom.parseFromString(soapXml, 'application/xml');
    const root = doc?.documentElement;
    if (!root)
        throw new Error('Aucune racine XML trouvée');
    const decoded = root?.textContent
        ? root.textContent
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\\</g, '<')
            .replace(/\\>/g, '>')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
        : root.textContent;
    const objdecoded = dom.parseFromString(decoded ?? '', 'application/xml');
    const objectsNode = objdecoded.getElementsByTagName('objects')[0];
    const singleObject = objdecoded.getElementsByTagName('object')[0];
    if (objectsNode) {
        const objectNodes = Array.from(objectsNode.getElementsByTagName('object'));
        const results = objectNodes.map(parseXmlObjectNode);
        return results;
    }
    else if (singleObject) {
        return parseXmlObjectNode(singleObject);
    }
    else {
        return parseSoapEmbeddedXmlToJson(soapXml);
    }
}
/* ------------------------------ parseXmlObjectNode (xmldom) ------------------------------ */
function parseXmlObjectNode(objectNode) {
    const result = {};
    const typename = objectNode.getAttribute('typename');
    if (typename) {
        result.typename = typename;
    }
    // <param .../> direct children
    const paramNodes = Array.from(objectNode.getElementsByTagName('param'));
    for (const param of paramNodes) {
        const { name, value } = extractParamValueFromElement(param);
        if (name)
            result[name] = value;
    }
    // Sous-sections imbriquées (qint, xtlog, etc.)
    const childNodes = Array.from(objectNode.childNodes).filter((n) => n.nodeType === 1 && n.nodeName !== 'param');
    for (const child of childNodes) {
        const sectionName = child.nodeName;
        const innerObjects = child.getElementsByTagName('object');
        if (innerObjects.length > 0) {
            const parsedChildren = Array.from(innerObjects).map(parseXmlObjectNode);
            result[sectionName] = parsedChildren;
        }
    }
    return result;
}
/* ------------------------------ parseNestedObject / parseFastXmlObject ------------------------------ */
function parseNestedObject(node) {
    const output = {};
    if (node?.param) {
        const params = Array.isArray(node.param) ? node.param : [node.param];
        for (const p of params) {
            const { name, value } = extractParamValueFast(p);
            if (name)
                output[name] = value;
        }
    }
    if (pickAttrFast(node, 'typename')) {
        output.typename = pickAttrFast(node, 'typename');
    }
    for (const [key, value] of Object.entries(node || {})) {
        if (['param', `${FAST_ATTR_PREFIX}typename`, 'typename'].includes(key))
            continue;
        const sub = value;
        if (sub?.objects?.object) {
            const subObjects = Array.isArray(sub.objects.object) ? sub.objects.object : [sub.objects.object];
            output[capitalize(key)] = subObjects.map(parseNestedObject);
        }
        else if (sub?.object) {
            const subObjects = Array.isArray(sub.object) ? sub.object : [sub.object];
            output[capitalize(key)] = subObjects.map(parseNestedObject);
        }
    }
    return output;
}
function parseFastXmlObject(obj) {
    const output = {};
    const params = Array.isArray(obj?.param) ? obj.param : [obj?.param].filter(Boolean);
    for (const p of params) {
        const { name, value } = extractParamValueFast(p);
        if (name)
            output[name] = value;
    }
    return output;
}
function capitalize(key) {
    return key.charAt(0).toUpperCase() + key.slice(1);
}
/* ------------------------------ new_parseObjectXmlToJson ------------------------------ */
function serializeXmlElement(element) {
    return new xmldom_1.XMLSerializer().serializeToString(element);
}
function new_parseObjectXmlToJson(xml) {
    const parsed = fastParser.parse(xml);
    const obj = parsed?.object;
    if (!obj || !obj.param)
        return {};
    const output = {};
    const params = Array.isArray(obj.param) ? obj.param : [obj.param];
    for (const p of params) {
        const { name, value } = extractParamValueFast(p);
        if (name)
            output[name] = value;
    }
    return output;
}
/* ------------------------------ parseProdSoapResponse ------------------------------ */
async function parseProdSoapResponse(xmlString) {
    const produits = [];
    const _xmlContent = xmlString
        .replace(/\\</g, '<')
        .replace(/\\>/g, '>')
        .replace(/\\\//g, '/')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
    const rawContentMatch = _xmlContent.match(/<prod-rows[^>]*>([\s\S]*?)<\/prod-rows>/);
    if (rawContentMatch) {
        return parseprod_content(rawContentMatch[0], produits);
    }
    else if (_xmlContent) {
        return await parse_Produit_SoapXml(xmlString);
    }
    else {
        throw new Error('rawContentMatch introuvable dans la réponse SOAP');
    }
}
function parseprod_content(content, produits) {
    const dom = new xmldom_1.DOMParser();
    const xmlDoc = dom.parseFromString(content, 'text/xml');
    const prodElements = xmlDoc.getElementsByTagName('prod');
    for (let i = 0; i < prodElements.length; i++) {
        const prod = prodElements[i];
        const produit = get_prod(prod);
        produits.push(produit);
    }
    return produits.length > 1 ? produits : produits[0];
}
function get_prod(prod) {
    const getTagValue = (tagName) => {
        const el = prod.getElementsByTagName(tagName)[0];
        return el?.textContent?.trim() ?? '';
    };
    return {
        codeprod: getTagValue('b_codeprod'),
        branche: getTagValue('b_branche'),
        branc: getTagValue('b_branc'),
        libelle: getTagValue('b_libelle'),
        cieprin: getTagValue('b_cieprin'),
        pronopol: getTagValue('b_pronopol'),
        pronoave: getTagValue('b_pronoave'),
        groupe: getTagValue('b_groupe'),
        tartype: getTagValue('b_tartype'),
        tardev: getTagValue('b_tardev'),
        tarcle: getTagValue('b_tarcle'),
        tararro: getTagValue('b_tararro'),
        tauxatt: getTagValue('b_tauxatt'),
        nondispo: getTagValue('b_nondispo'),
        majcrm: getTagValue('b_majcrm'),
        catalog: getTagValue('b_catalog'),
        typarro: getTagValue('b_typarro'),
        fvahom: getTagValue('b_fvahom'),
    };
}
/* ------------------------------ parse_Produit_SoapXml (xml2js) ------------------------------ */
async function parse_Produit_SoapXml(xml) {
    try {
        const parsed = await (0, xml2js_1.parseStringPromise)(xml, {
            explicitArray: false,
            mergeAttrs: true,
            tagNameProcessors: [name => name.replace(/^.*:/, '')],
            trim: true,
        });
        const dataXml = parsed.Envelope?.Body?.BasActionResult?.Data;
        let embeddedXml = '';
        if (typeof dataXml === 'string') {
            embeddedXml = dataXml.trim();
        }
        else if (typeof dataXml === 'object' && typeof dataXml._ === 'string') {
            embeddedXml = dataXml._.trim();
        }
        else {
            const firstKey = Object.keys(dataXml || {}).find(k => typeof dataXml[k] === 'string');
            if (firstKey)
                embeddedXml = dataXml[firstKey].trim();
        }
        if (!embeddedXml) {
            throw new Error('No embedded XML in <Data> field');
        }
        let innerParsed;
        try {
            innerParsed = await (0, xml2js_1.parseStringPromise)(embeddedXml, {
                explicitArray: false,
                mergeAttrs: true,
                trim: true,
            });
        }
        catch {
            const cleaned = embeddedXml
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
                .replace(/\r|\n|\t/g, '')
                .replace(/="/g, '="')
                .replace(/"\s*</g, '"<');
            innerParsed = await (0, xml2js_1.parseStringPromise)(cleaned, {
                explicitArray: false,
                mergeAttrs: true,
                trim: true,
            });
        }
        const params = innerParsed?.produit?.object?.param;
        if (!params || (Array.isArray(params) && params.length === 0)) {
            throw new Error('No <param> tags found in embedded XML');
        }
        const result = {};
        const paramArray = Array.isArray(params) ? params : [params];
        for (const param of paramArray) {
            const typeNorm = (param.type ?? '').toLowerCase();
            // 0) Si type string => toujours contenu textuel, même s'il ressemble à un nombre
            if (typeNorm === 'ptstring' || typeNorm === 'string') {
                result[param.name] = toStringSafe(param._);
                continue;
            }
            // 1) Dates
            if (param.date_val !== undefined) {
                result[param.name] = String(param.date_val).trim();
                continue;
            }
            if (param.datetime_val !== undefined) {
                result[param.name] = String(param.datetime_val).trim();
                continue;
            }
            if (param.time_val !== undefined) {
                result[param.name] = String(param.time_val).trim();
                continue;
            }
            // 2) Booléen / Int / Float
            if (param.is_null === 'true') {
                result[param.name] = null;
            }
            else if (param.bool_val !== undefined) {
                result[param.name] = param.bool_val === 'true';
            }
            else if (param.int_val !== undefined) {
                result[param.name] = toInt(param.int_val);
            }
            else if (param.float_val !== undefined) {
                result[param.name] = toFloatStrict(param.float_val); // support "0.0000E+0000"
            }
            else if (param._ !== undefined) {
                // 3) Contenu textuel générique
                // S'il n'y a pas de type explicite, on renvoie la valeur telle quelle (string) trimée
                result[param.name] = toStringSafe(param._);
            }
            else {
                result[param.name] = '';
            }
        }
        return result;
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('SOAP XML parsing failed:', error);
        throw new Error('Invalid SOAP response or unexpected structure');
    }
}
/* ------------------------------ parseTabRowsXml ------------------------------ */
async function parseTabRowsXml(xml) {
    try {
        const decoded = xml
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\\</g, '<')
            .replace(/\\>/g, '>')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        const parsed = await (0, xml2js_1.parseStringPromise)(decoded, {
            explicitArray: false,
            tagNameProcessors: [name => name.replace(/^.*:/, '')],
            mergeAttrs: true,
            trim: true,
        });
        const BasActionResult = parsed.Envelope?.Body?.BasActionResult;
        const data = BasActionResult?.Data;
        const tabs = data?.['tab-rows']?.tab;
        if (!tabs)
            throw new Error('No <tab> array found in <tab-rows>');
        const tabArray = Array.isArray(tabs) ? tabs : [tabs];
        return tabArray.map((tab) => ({
            value: tab._ ?? '',
            type: tab.type ?? '',
            align: tab.align ?? '',
            size: tab.size ? Number(tab.size) : undefined,
        }));
    }
    catch (error) {
        throw new Error(error?.message ?? 'parseTabRowsXml failed');
    }
}
/* ------------------------------ extractDataXml / ensureArray ------------------------------ */
function extractDataXml(BasActionResult) {
    const data = BasActionResult?.Data;
    if (!data)
        return undefined;
    if (typeof data === 'string')
        return data.trim();
    if (typeof data._ === 'string')
        return data._.trim();
    if (Array.isArray(data)) {
        for (const d of data) {
            if (typeof d === 'string' && d.trim())
                return d.trim();
            if (typeof d?._ === 'string' && d._.trim())
                return d._.trim();
        }
    }
    if (typeof data === 'object' && data._)
        return String(data._).trim();
    return undefined;
}
function ensureArray(value) {
    if (value === undefined)
        return [];
    return Array.isArray(value) ? value : [value];
}
/* ------------------------------ extractAndCleanEmbeddedXml ------------------------------ */
/** Nettoie et extrait le XML embedded du champ Data dans un XML SOAP. */
function extractAndCleanEmbeddedXml(parsedSoap) {
    let dataXml = parsedSoap?.Envelope?.Body?.BasActionResult?.Data;
    if (!dataXml)
        throw new Error('No <Data> field found in SOAP XML');
    let embeddedXml = '';
    if (typeof dataXml === 'string') {
        embeddedXml = dataXml.trim();
    }
    else if (typeof dataXml === 'object' && typeof dataXml._ === 'string') {
        embeddedXml = dataXml._.trim();
    }
    else {
        const firstKey = Object.keys(dataXml || {}).find(k => typeof dataXml[k] === 'string');
        if (firstKey)
            embeddedXml = dataXml[firstKey].trim();
    }
    if (!embeddedXml)
        throw new Error('No embedded XML in <Data> field');
    embeddedXml = embeddedXml
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'")
        .replace(/&#34;/g, '"')
        .replace(/<\?xml.*?\?>/g, '')
        .trim();
    return embeddedXml;
}
/* ------------------------------ parseSoapEmbeddedXmlToJson ------------------------------ */
/**
 * Parse le XML SOAP, extrait et nettoie le XML embedded, puis le parse en JSON.
 * Forçage d'une clé à être TOUJOURS un tableau via `forceArrayKey` (optionnel).
 */
async function parseSoapEmbeddedXmlToJson(xmlString, forceArrayKey) {
    const parsedSoap = await (0, xml2js_1.parseStringPromise)(xmlString, {
        explicitArray: false,
        mergeAttrs: true,
        tagNameProcessors: [name => name.replace(/^.*:/, '')],
        trim: true,
    });
    const embeddedXml = extractAndCleanEmbeddedXml(parsedSoap);
    const result = await (0, xml2js_1.parseStringPromise)(embeddedXml, {
        explicitArray: false,
        mergeAttrs: true,
        tagNameProcessors: [name => name.replace(/^.*:/, '')],
        valueProcessors: [v => (typeof v === 'string' ? v.trim() : v)],
        trim: true,
    });
    if (forceArrayKey) {
        function forceKeyAsArray(obj) {
            if (!obj || typeof obj !== 'object')
                return obj;
            Object.keys(obj).forEach(key => {
                if (key === forceArrayKey && obj[key]) {
                    obj[key] = ensureArray(obj[key]);
                }
                else if (typeof obj[key] === 'object') {
                    forceKeyAsArray(obj[key]);
                }
            });
        }
        forceKeyAsArray(result);
    }
    return result;
}
