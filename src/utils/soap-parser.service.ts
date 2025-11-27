/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from 'fast-xml-parser';
import { DOMParser, XMLSerializer } from 'xmldom';
import { Produit } from '../Model/produit.model';
import { Parser, parseStringPromise } from 'xml2js';

export interface XmlParsedObject {
  [key: string]: string | number | boolean | null | XmlParsedObject | XmlParsedObject[];
}

interface Param {
  name: string;
  type?: string;
  int_val?: string;
  bool_val?: string;
  float_val?: string;
  date_val?: string;
  datetime_val?: string;
  time_val?: string;
  is_null?: string;
  _: string;
}

type Constructor<T> = new (...args: any[]) => T;

const FAST_ATTR_PREFIX = '@_';

const fastParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: FAST_ATTR_PREFIX,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  allowBooleanAttributes: true,
});

/* ------------------------------ Helpers ------------------------------ */

const isTrue = (v: any): boolean =>
  v === true || v === 'true' || v === '1' || v === 1;

const toInt = (v: any): number | null => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

/** Conversion robuste des floats (gère E+0002, virgules, espaces) */
const toFloatStrict = (v: any): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  let s = String(v).trim();
  if (!s) return null;
  // Remplacer virgule décimale éventuelle
  s = s.replace(',', '.');
  // Normaliser exposants de type E+0002 / E-0002 -> E+2 / E-2
  s = s.replace(/e([+-])0+(\d+)/i, 'e$1$2');
  // Supprimer espaces résiduels autour de E
  s = s.replace(/\s*e\s*/i, 'e');
  // Conversion
  const n = Number(s);
  if (Number.isFinite(n)) return n;
  const n2 = parseFloat(s);
  return Number.isFinite(n2) ? n2 : null;
};

const toStringSafe = (v: any): string =>
  v === null || v === undefined ? '' : String(v).trim();

const pickAttrFast = (obj: any, name: string): any => {
  // Cherche successivement @_<name>, name, lower/upper variants
  const k1 = `${FAST_ATTR_PREFIX}${name}`;
  if (obj && Object.prototype.hasOwnProperty.call(obj, k1)) return obj[k1];
  if (obj && Object.prototype.hasOwnProperty.call(obj, name)) return obj[name];
  const low = name.toLowerCase();
  const up = name.toUpperCase();
  if (obj && Object.prototype.hasOwnProperty.call(obj, low)) return obj[low];
  if (obj && Object.prototype.hasOwnProperty.call(obj, up)) return obj[up];
  return undefined;
};

const isStringType = (t: any): boolean => {
  const v = typeof t === 'string' ? t.trim().toLowerCase() : '';
  return v === 'ptstring' || v === 'string';
};

const extractParamValueFast = (param: any): { name: string | undefined; value: any } => {
  const name = pickAttrFast(param, 'name');
  const isNull = pickAttrFast(param, 'is_null');
  if (isTrue(isNull)) return { name, value: null };

  const typeAttr = pickAttrFast(param, 'type');

  // 0) Si le type est string => toujours renvoyer le contenu textuel (même s'il ressemble à un nombre)
  if (isStringType(typeAttr)) {
    // fast-xml-parser place le texte sous '#text' (et peut déjà avoir parsé en number/bool)
    const textAny = (param && Object.prototype.hasOwnProperty.call(param, '#text'))
      ? (param as any)['#text']
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
    if (first !== undefined) return { name, value: toStringSafe(first) };
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
  if (intVal !== undefined) return { name, value: toInt(intVal) };

  const floatVal = pickAttrFast(param, 'float_val');
  if (floatVal !== undefined) return { name, value: toFloatStrict(floatVal) };

  const boolVal = pickAttrFast(param, 'bool_val');
  if (boolVal !== undefined) return { name, value: isTrue(boolVal) };

  // 3) Contenu textuel (#text) — accepter string/number/bool
  if (param && Object.prototype.hasOwnProperty.call(param, '#text')) {
    const raw = (param as any)['#text'];
    // Si pas de type explicite, on renvoie "tel quel" (string/number/bool), mais trim si string
    return { name, value: typeof raw === 'string' ? raw.trim() : raw };
  }

  // 4) fallback vide
  return { name, value: '' };
};

const extractParamValueFromElement = (paramEl: Element): { name: string | null; value: any } => {
  const name = paramEl.getAttribute('name');
  const isNull = paramEl.getAttribute('is_null');
  if (isTrue(isNull)) return { name, value: null };

  const typeAttr = paramEl.getAttribute('type');

  // Si type string => toujours le texte (même si "3021190")
  if (isStringType(typeAttr)) {
    return { name, value: toStringSafe(paramEl.textContent) };
  }

  // 1) Dates
  const dateAttr =
    paramEl.getAttribute('date_val') ??
    paramEl.getAttribute('datetime_val') ??
    paramEl.getAttribute('time_val') ??
    paramEl.getAttribute('date') ??
    paramEl.getAttribute('datetime');
  if (dateAttr && dateAttr.trim() !== '') {
    return { name, value: dateAttr.trim() };
  }

  // 2) Numériques / booléens
  const intVal = paramEl.getAttribute('int_val');
  if (intVal !== null && intVal !== undefined) return { name, value: toInt(intVal) };

  const floatVal = paramEl.getAttribute('float_val');
  if (floatVal !== null && floatVal !== undefined) return { name, value: toFloatStrict(floatVal) };

  const boolVal = paramEl.getAttribute('bool_val');
  if (boolVal !== null && boolVal !== undefined) return { name, value: isTrue(boolVal) };

  // 3) Texte (accepter tout)
  return { name, value: toStringSafe(paramEl.textContent) };
};

/* ------------------------------ parseSoapXmlToJson ------------------------------ */
/** Parse une réponse SOAP XML contenant un champ <Data> encodé. */
export async function parseSoapXmlToJson<T = any | any[]>(soapXml: string, datanode?: string): Promise<T | T[]> {
  try {
    const dom = new DOMParser();
    const serializer = new XMLSerializer();
    const doc = dom.parseFromString(soapXml, 'application/xml');

    let dname: string = datanode ? `${datanode}-rows` : '';
    if (datanode === 'tab') dname = 'tab-rows';
    else if (datanode === 'tabs') dname = 'tabs';
    else if (datanode === 'risks' || datanode === 'Risks') dname = 'risks';
    else if (['offers', 'projects', 'Offers', 'Projects', 'offer', 'project'].includes(datanode ?? '')) dname = 'offers';

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
    } else {
      isList = root.tagName.toLowerCase().endsWith('s');
    }

    const tagname = datanode ? datanode : '';
    const rawnode = root.getElementsByTagName('object');
    const _rawnode = root.getElementsByTagName(tagname);
    const __rawnode = root.getElementsByTagName(`${tagname}-rows`);
    const ___rawnode = root.getElementsByTagName('Data');
    let rawNodes: any = rawnode.length > 0 ? rawnode : __rawnode;
    rawNodes = rawNodes.length > 0 ? rawNodes : _rawnode;
    rawNodes = rawNodes.length > 0 ? rawNodes : ___rawnode;

    // Plusieurs objets
    if (isList || rawNodes.length > 0) {
      const objectNodes: Element[] = Array.from(rawNodes);
      if (objectNodes.length === 0) {
        throw new Error(`Aucun élément <object> trouvé dans le XML et Datanode=${datanode}`);
      }
      const results = objectNodes.map(node => {
        const xmlString = serializer.serializeToString(node);
        return parseObjectXmlToJson(xmlString);
      });
      return (results.length > 1 ? results : results[0]) as any;
    } else {
      const xmlString = new XMLSerializer().serializeToString(rawNodes[0]);
      const result = await parseSoapEmbeddedXmlToJson(xmlString);
      return result as T;
    }
  } catch (error: any) {
    throw new Error(error?.message ?? 'parseSoapXmlToJson failed');
  }
}

/* ------------------------------ xmlToJsonSync ------------------------------ */
export function xmlToJsonSync(xml: string): Record<string, any> {
  let output: Record<string, any> = {};
  const parser = new Parser({
    explicitArray: false,
    mergeAttrs: true,
    trim: true,
    valueProcessors: [
      // laisse xml2js typer les nombres, mais ce parseur est un fallback ; la voie principale gère ptString correctement
      (value: string) => (!isNaN(Number(value)) && value.trim() !== '' ? Number(value) : value),
    ],
  });
  parser.parseString(xml, (err, result) => {
    if (err) throw err;
    output = extractFirstDataChild(result);
  });
  return output;
}

/** Renvoie le premier objet-fils du root (ignore les attributs racine) */
function extractFirstDataChild(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  const keys = Object.keys(obj).filter(
    (k) => !k.startsWith('xmlns') && !k.startsWith('xsi') && k !== '$'
  );
  for (const k of keys) {
    if (typeof obj[k] === 'object') return obj[k];
  }
  if (keys.length) return obj[keys[0]];
  return obj;
}

/** Si le root a un seul noeud, on l'aplatit (ex: {data: {...}} => {...}) */
function flattenRoot(obj: any): any {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).length === 1 &&
    typeof obj[Object.keys(obj)[0]] === 'object'
  ) {
    return obj[Object.keys(obj)[0]];
  }
  return obj;
}

/* ------------------------------ parseObjectXmlToJson (fast-xml-parser) ------------------------------ */
interface ParsedJson {
  [key: string]: string | number | boolean | null;
}

export function parseObjectXmlToJson(xml: string): ParsedJson {
  const result = fastParser.parse(xml);

  if (!result || !result.object || !result.object.param) {
    // Fallback : ancienne logique
    return xmlToJsonSync(xml);
  }

  const params = Array.isArray(result.object.param)
    ? result.object.param
    : [result.object.param];

  const output: ParsedJson = {};

  for (const p of params) {
    const { name, value } = extractParamValueFast(p);
    if (name) output[name] = value;
  }

  // typename (si présent)
  const tn = pickAttrFast(result.object, 'typename');
  if (tn) (output as any).typename = tn;

  return output;
}

/* ------------------------------ new_parseSoapXmlToJson ------------------------------ */
export interface new_ParsedJson {
  [key: string]: string | number | boolean | null | new_ParsedJson[] | new_ParsedJson;
}

export function new_parseSoapXmlToJson<T = any | any[]>(soapXml: string, datanode?: string): T {
  const dom = new DOMParser();
  const doc = dom.parseFromString(soapXml, 'application/xml');

  const root: HTMLElement | null = doc?.documentElement as any;
  if (!root) throw new Error('Aucune racine XML trouvée');

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
    return results as T;
  } else if (singleObject) {
    return parseXmlObjectNode(singleObject) as T;
  } else {
    return parseSoapEmbeddedXmlToJson(soapXml) as T;
  }
}

/* ------------------------------ parseXmlObjectNode (xmldom) ------------------------------ */
function parseXmlObjectNode(objectNode: Element): new_ParsedJson {
  const result: new_ParsedJson = {};

  const typename = objectNode.getAttribute('typename');
  if (typename) {
    (result as any).typename = typename;
  }

  // <param .../> direct children
  const paramNodes = Array.from(objectNode.getElementsByTagName('param'));
  for (const param of paramNodes) {
    const { name, value } = extractParamValueFromElement(param);
    if (name) (result as any)[name] = value;
  }

  // Sous-sections imbriquées (qint, xtlog, etc.)
  const childNodes = Array.from(objectNode.childNodes).filter(
    (n) => n.nodeType === 1 && (n as Element).nodeName !== 'param'
  ) as Element[];

  for (const child of childNodes) {
    const sectionName = child.nodeName;
    const innerObjects = child.getElementsByTagName('object');
    if (innerObjects.length > 0) {
      const parsedChildren = Array.from(innerObjects).map(parseXmlObjectNode);
      (result as any)[sectionName] = parsedChildren;
    }
  }

  return result;
}

/* ------------------------------ parseNestedObject / parseFastXmlObject ------------------------------ */
function parseNestedObject(node: any): new_ParsedJson {
  const output: new_ParsedJson = {};

  if (node?.param) {
    const params = Array.isArray(node.param) ? node.param : [node.param];
    for (const p of params) {
      const { name, value } = extractParamValueFast(p);
      if (name) (output as any)[name] = value;
    }
  }

  if (pickAttrFast(node, 'typename')) {
    (output as any).typename = pickAttrFast(node, 'typename');
  }

  for (const [key, value] of Object.entries(node || {})) {
    if (['param', `${FAST_ATTR_PREFIX}typename`, 'typename'].includes(key)) continue;

    const sub = value as any;

    if (sub?.objects?.object) {
      const subObjects = Array.isArray(sub.objects.object) ? sub.objects.object : [sub.objects.object];
      (output as any)[capitalize(key)] = subObjects.map(parseNestedObject);
    } else if (sub?.object) {
      const subObjects = Array.isArray(sub.object) ? sub.object : [sub.object];
      (output as any)[capitalize(key)] = subObjects.map(parseNestedObject);
    }
  }

  return output;
}

function parseFastXmlObject(obj: any): new_ParsedJson {
  const output: new_ParsedJson = {};
  const params = Array.isArray(obj?.param) ? obj.param : [obj?.param].filter(Boolean);
  for (const p of params) {
    const { name, value } = extractParamValueFast(p);
    if (name) (output as any)[name] = value;
  }
  return output;
}

function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/* ------------------------------ new_parseObjectXmlToJson ------------------------------ */
function serializeXmlElement(element: Element): string {
  return new XMLSerializer().serializeToString(element);
}

export function new_parseObjectXmlToJson(xml: string): new_ParsedJson {
  const parsed = fastParser.parse(xml);
  const obj = parsed?.object;
  if (!obj || !obj.param) return {};

  const output: new_ParsedJson = {};
  const params = Array.isArray(obj.param) ? obj.param : [obj.param];

  for (const p of params) {
    const { name, value } = extractParamValueFast(p);
    if (name) (output as any)[name] = value;
  }

  return output;
}

/* ------------------------------ parseProdSoapResponse ------------------------------ */
export async function parseProdSoapResponse(xmlString: string): Promise<any> {
  const produits: Produit[] = [];

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
  } else if (_xmlContent) {
    return await parse_Produit_SoapXml(xmlString);
  } else {
    throw new Error('rawContentMatch introuvable dans la réponse SOAP');
  }
}

function parseprod_content(content: string, produits: any) {
  const dom = new DOMParser();
  const xmlDoc = dom.parseFromString(content, 'text/xml');
  const prodElements = xmlDoc.getElementsByTagName('prod');

  for (let i = 0; i < prodElements.length; i++) {
    const prod = prodElements[i];
    const produit: Produit = get_prod(prod);
    produits.push(produit);
  }
  return produits.length > 1 ? (produits as Produit[]) : (produits[0] as Produit);
}

function get_prod(prod: Element) {
  const getTagValue = (tagName: string): any => {
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
export async function parse_Produit_SoapXml(xml: string): Promise<any> {
  try {
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      mergeAttrs: true,
      tagNameProcessors: [name => name.replace(/^.*:/, '')],
      trim: true,
    });

    const dataXml = parsed.Envelope?.Body?.BasActionResult?.Data;
    let embeddedXml = '';

    if (typeof dataXml === 'string') {
      embeddedXml = dataXml.trim();
    } else if (typeof dataXml === 'object' && typeof (dataXml as any)._ === 'string') {
      embeddedXml = (dataXml as any)._.trim();
    } else {
      const firstKey = Object.keys(dataXml || {}).find(k => typeof (dataXml as any)[k] === 'string');
      if (firstKey) embeddedXml = (dataXml as any)[firstKey].trim();
    }

    if (!embeddedXml) {
      throw new Error('No embedded XML in <Data> field');
    }

    let innerParsed: any;
    try {
      innerParsed = await parseStringPromise(embeddedXml, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      });
    } catch {
      const cleaned = embeddedXml
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/\r|\n|\t/g, '')
        .replace(/="/g, '="')
        .replace(/"\s*</g, '"<');

      innerParsed = await parseStringPromise(cleaned, {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      });
    }

    const params: Param[] = innerParsed?.produit?.object?.param;
    if (!params || (Array.isArray(params) && params.length === 0)) {
      throw new Error('No <param> tags found in embedded XML');
    }

    const result: Record<string, any> = {};
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
      } else if (param.bool_val !== undefined) {
        result[param.name] = param.bool_val === 'true';
      } else if (param.int_val !== undefined) {
        result[param.name] = toInt(param.int_val);
      } else if (param.float_val !== undefined) {
        result[param.name] = toFloatStrict(param.float_val); // support "0.0000E+0000"
      } else if (param._ !== undefined) {
        // 3) Contenu textuel générique
        // S'il n'y a pas de type explicite, on renvoie la valeur telle quelle (string) trimée
        result[param.name] = toStringSafe(param._);
      } else {
        result[param.name] = '';
      }
    }

    return result as any;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('SOAP XML parsing failed:', error);
    throw new Error('Invalid SOAP response or unexpected structure');
  }
}

/* ------------------------------ parseTabRowsXml ------------------------------ */
export async function parseTabRowsXml(xml: string): Promise<any> {
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

    const parsed = await parseStringPromise(decoded, {
      explicitArray: false,
      tagNameProcessors: [name => name.replace(/^.*:/, '')],
      mergeAttrs: true,
      trim: true,
    });

    const BasActionResult = parsed.Envelope?.Body?.BasActionResult;
    const data = BasActionResult?.Data;
    const tabs = data?.['tab-rows']?.tab;
    if (!tabs) throw new Error('No <tab> array found in <tab-rows>');

    const tabArray = Array.isArray(tabs) ? tabs : [tabs];

    return tabArray.map((tab: any) => ({
      value: tab._ ?? '',
      type: tab.type ?? '',
      align: tab.align ?? '',
      size: tab.size ? Number(tab.size) : undefined,
    }));
  } catch (error: any) {
    throw new Error(error?.message ?? 'parseTabRowsXml failed');
  }
}

/* ------------------------------ extractDataXml / ensureArray ------------------------------ */
function extractDataXml(BasActionResult: any): string | undefined {
  const data = BasActionResult?.Data;
  if (!data) return undefined;

  if (typeof data === 'string') return data.trim();
  if (typeof (data as any)._ === 'string') return (data as any)._.trim();

  if (Array.isArray(data)) {
    for (const d of data) {
      if (typeof d === 'string' && d.trim()) return d.trim();
      if (typeof (d as any)?._ === 'string' && (d as any)._.trim()) return (d as any)._.trim();
    }
  }
  if (typeof data === 'object' && (data as any)._)
    return String((data as any)._).trim();
  return undefined;
}

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/* ------------------------------ extractAndCleanEmbeddedXml ------------------------------ */
/** Nettoie et extrait le XML embedded du champ Data dans un XML SOAP. */
function extractAndCleanEmbeddedXml(parsedSoap: any): string {
  let dataXml = parsedSoap?.Envelope?.Body?.BasActionResult?.Data;
  if (!dataXml) throw new Error('No <Data> field found in SOAP XML');

  let embeddedXml = '';
  if (typeof dataXml === 'string') {
    embeddedXml = dataXml.trim();
  } else if (typeof dataXml === 'object' && typeof (dataXml as any)._ === 'string') {
    embeddedXml = (dataXml as any)._.trim();
  } else {
    const firstKey = Object.keys(dataXml || {}).find(k => typeof (dataXml as any)[k] === 'string');
    if (firstKey) embeddedXml = (dataXml as any)[firstKey].trim();
  }

  if (!embeddedXml) throw new Error('No embedded XML in <Data> field');

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
export async function parseSoapEmbeddedXmlToJson(xmlString: string, forceArrayKey?: string): Promise<any> {
  const parsedSoap = await parseStringPromise(xmlString, {
    explicitArray: false,
    mergeAttrs: true,
    tagNameProcessors: [name => name.replace(/^.*:/, '')],
    trim: true,
  });

  const embeddedXml = extractAndCleanEmbeddedXml(parsedSoap);

  const result = await parseStringPromise(embeddedXml, {
    explicitArray: false,
    mergeAttrs: true,
    tagNameProcessors: [name => name.replace(/^.*:/, '')],
    valueProcessors: [v => (typeof v === 'string' ? v.trim() : v)],
    trim: true,
  });

  if (forceArrayKey) {
    function forceKeyAsArray(obj: any) {
      if (!obj || typeof obj !== 'object') return obj;
      Object.keys(obj).forEach(key => {
        if (key === forceArrayKey && obj[key]) {
          obj[key] = ensureArray(obj[key]);
        } else if (typeof obj[key] === 'object') {
          forceKeyAsArray(obj[key]);
        }
      });
    }
    forceKeyAsArray(result);
  }

  return result;
}
