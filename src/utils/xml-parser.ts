import { create } from 'xmlbuilder2';

/* --------------------------------- Utils ---------------------------------- */

function isIsoDateString(s: string): boolean {
  if (!s) return false;
  const isoLike = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+\-]\d{2}:\d{2})?)?$/;
  if (!isoLike.test(s)) return false;
  const d = new Date(s);
  return !isNaN(+d);
}

function getXMLTypeAndValue(value: any): {
  type: 'ptString' | 'ptInt' | 'ptFloat' | 'ptBool' | 'ptDateTime' | 'ptUnknown';
  attrs: Record<string, string>;
  text?: string;
} {
  if (value === null || value === undefined) {
    return { type: 'ptUnknown', attrs: { is_null: 'true' } };
  }
  switch (typeof value) {
    case 'boolean':
      return { type: 'ptBool', attrs: { bool_val: String(value) } };
    case 'number':
      if (Number.isInteger(value)) return { type: 'ptInt', attrs: { int_val: String(value) } };
      return { type: 'ptFloat', attrs: { float_val: value.toExponential(14).replace('e', 'E') } };
    case 'string':
      if (isIsoDateString(value)) {
        const iso = new Date(value).toISOString();
        return { type: 'ptDateTime', attrs: { date_val: iso } };
      }
      return { type: 'ptString', attrs: {}, text: value };
    default:
      return { type: 'ptUnknown', attrs: { is_null: 'true' } };
  }
}

/** Ajoute tous les <param> d’un objet simple dans un <object typename="..."> déjà créé. */
function addParamsToObject(objectEle: any, record: Record<string, any>) {
  for (const [paramName, paramValue] of Object.entries(record ?? {})) {
    // Si une propriété interne est elle-même un objet → on “aplatit” en param texte JSON
    if (paramValue && typeof paramValue === 'object' && !Array.isArray(paramValue)) {
      const { type, attrs, text } = getXMLTypeAndValue(JSON.stringify(paramValue));
      const p = objectEle.ele('param').att('name', String(paramName)).att('type', type);
      for (const [k, v] of Object.entries(attrs)) p.att(k, v);
      if (text !== undefined && type === 'ptString') p.txt(text);
      continue;
    }

    // Tableaux internes (rares) → un param par entrée
    if (Array.isArray(paramValue)) {
      paramValue.forEach((v, idx) => {
        const { type, attrs, text } = getXMLTypeAndValue(v);
        const p = objectEle.ele('param')
          .att('name', `${paramName}[${idx}]`)
          .att('type', type);
        for (const [k, v2] of Object.entries(attrs)) p.att(k, v2);
        if (text !== undefined && type === 'ptString') p.txt(text);
      });
      continue;
    }

    const { type, attrs, text } = getXMLTypeAndValue(paramValue);
    const p = objectEle.ele('param').att('name', String(paramName)).att('type', type);
    for (const [k, v] of Object.entries(attrs)) p.att(k, v);
    if (text !== undefined && type === 'ptString') p.txt(text);
  }
}

/**
 * Ajoute un objet (ou un tableau d’objets) sous le conteneur <objects>.
 * - Si `value` est un objet simple → un seul <object typename="KEY">...</object>.
 * - Si `value` est un tableau d’objets → **un <object> par élément** (c’est la correction demandée).
 * - Si `value` est un tableau de scalaires → un seul <object> avec plusieurs <param name="key[i]">.
 */
function appendUnderObjects(objectsEle: any, key: string, value: any) {
  const TYPE = String(key).toUpperCase();

  if (Array.isArray(value)) {
    // → CORRECTION : un <object typename="TYPE"> par élément si ce sont des objets
    const allObjects = value.every(v => v && typeof v === 'object' && !Array.isArray(v));
    if (allObjects) {
      value.forEach((record) => {
        const obj = objectsEle.ele('object').att('typename', TYPE);
        addParamsToObject(obj, record);
      });
    } else {
      // Tableau de scalaires : on conserve un seul <object> avec params indexés
      const obj = objectsEle.ele('object').att('typename', TYPE);
      value.forEach((v, idx) => {
        const { type, attrs, text } = getXMLTypeAndValue(v);
        const p = obj.ele('param').att('name', `${key}[${idx}]`).att('type', type);
        for (const [k, v2] of Object.entries(attrs)) p.att(k, v2);
        if (text !== undefined && type === 'ptString') p.txt(text);
      });
    }
    return;
  }

  if (value && typeof value === 'object') {
    const obj = objectsEle.ele('object').att('typename', TYPE);
    addParamsToObject(obj, value);
    return;
  }

  // Valeur atomique → un seul <object> avec un <param>
  const obj = objectsEle.ele('object').att('typename', TYPE);
  const { type, attrs, text } = getXMLTypeAndValue(value);
  const p = obj.ele('param').att('name', key).att('type', type);
  for (const [k, v] of Object.entries(attrs)) p.att(k, v);
  if (text !== undefined && type === 'ptString') p.txt(text);
}

/* ----------------------------- Générateurs XML ----------------------------- */

/** 
 * Génère: <data><input><objects> ... </objects></input></data>
 * NB: `_root` est ignoré pour garantir une enveloppe stable “data”.
 */
export function objectToXML(data: Record<string, any>, _root: string): string {
  const root = create().ele('data');
  const objects = root.ele('input').ele('objects');

  for (const [key, value] of Object.entries(data ?? {})) {
    appendUnderObjects(objects, key, value);
  }

  return root.end({ prettyPrint: true, headless: true });
}

/** Variante paramétrable: <sid><input><objects>...</objects></input></sid> */
export function objectToCustomXML(data: Record<string, any>, sid: string): string {
  const root = create().ele(sid);
  const objects = root.ele('input').ele('objects');

  for (const [key, value] of Object.entries(data ?? {})) {
    appendUnderObjects(objects, key, value);
  }

  return root.end({ prettyPrint: true, headless: true });
}

/** Pour injecter l’XML dans un champ string (StrVal) d’un SOAP. */
export function xmlToEscapedForStrVal(xml: string): string {
  return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function objectToCustomXMLForStrVal(data: Record<string, any>, sid: string): string {
  return xmlToEscapedForStrVal(objectToCustomXML(data, sid));
}
