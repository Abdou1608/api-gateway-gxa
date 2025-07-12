import { XMLParser } from 'fast-xml-parser';
import { DOMParser } from 'xmldom';
import { DOMImplementation, XMLSerializer } from 'xmldom';
export interface XmlParsedObject {
  [key: string]: string | number | boolean | null | XmlParsedObject | XmlParsedObject[];
}

type Constructor<T> = new (...args: any[]) => T;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: true,
  parseAttributeValue: true,
});


 //* Parse une réponse SOAP XML contenant un champ <Data> encodé.
 
 export function parseSoapXmlToJson<T = any | any[]>(soapXml: string, datanode?:string): T | T[]{
  const parser = new DOMParser();
  const doc = parser.parseFromString(soapXml, 'application/xml');
 

  const dataNode = doc.getElementsByTagName(datanode || 'Data' || datanode+'-rows' || 'data')[0];
  
  
  if (!dataNode || !dataNode.textContent) {
    throw new Error(datanode+' Ou <objects> introuvable dans la réponse SOAP oui Session utilisateur non valide');
  }

  const decoded = dataNode.textContent
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
   console.log("La valeur de decoded est ========"+decoded)
  const innerXml = parser.parseFromString(decoded, 'application/xml');
  const root = innerXml.documentElement;
  let isList=false
  if (datanode && datanode !== ""){
    const nodes = root.getElementsByTagName(datanode || 'Data' || 'rows_'+datanode || 'data') ;
    const node = nodes[0];
    isList = node ? node.nodeName.toLowerCase().endsWith('s') : false;
    
  } else {
    isList = root.tagName.toLowerCase().endsWith('s');
  }
  
  console.log("La valeur de isList est ========"+isList)
  const rawNodes = root.getElementsByTagName('object');
  console.log("La valeur de rawNodes  est ========"+rawNodes )
  console.log("La valeur de rawNodes[0]  est ========"+rawNodes[0] )
  // On vérifie explicitement la présence d'au moins un objet
  let objectNodes: Element[] = [];
  const serializer = new XMLSerializer();
  if (isList || rawNodes.length > 0) {
    objectNodes = Array.from(rawNodes); // plusieurs objets
    console.log("plusieurs objets trouvés")
   return objectNodes.map((node) =>{
      const xmlString = serializer.serializeToString(node);
      const result =parseObjectXmlToJson(xmlString)
      return result as T;
    })
      
  } else  {
   // objectNodes.push(rawNodes[0]); // un seul objet
   console.log("La valeur de rawNodes[0].textcontent  est ========"+rawNodes[0].textContent )
  
   const xmlString = serializer.serializeToString(rawNodes[0]);
   const result = xmlString ?? ""
   return  parseObjectXmlToJson(result)  as T;
 // return new_xmlNodeToJson(rawNodes[0]) as T
  }
  
  // Si aucun nœud trouvé, on retourne un tableau vide ou lance une erreur
  if (objectNodes.length === 0) {
    throw new Error("Aucun élément <object> trouvé dans le XML");
  }
  
  /* On mappe uniquement des nœuds valides
  const parsed = objectNodes.map((node) => node.textContent? parseObjectXmlToJson(node.textContent) : null);
  console.log("RESULTA DE arseSoapXmlToJson. PARSED....."+JSON.stringify(parsed))
  const result = parsed.length > 1 ? parsed : parsed[0];
// console.log("RESULTA DE arseSoapXmlToJson. result....."+JSON.stringify(result))
  return result as T;
  */
}
interface ParsedJson {
  [key: string]: string | number | boolean | null;
}

export function parseObjectXmlToJson(xml: string): ParsedJson {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseAttributeValue: true,
    trimValues: true
  });

  const result = parser.parse(xml);

  if (!result || !result.object || !result.object.param) {
    throw new Error("XML invalide ou aucun <param> trouvé.");
  }

  const paramNodes = Array.isArray(result.object.param)
    ? result.object.param
    : [result.object.param];

  const output: ParsedJson = {};

  for (const param of paramNodes) {
    const name = param['@_name'];
    const type = param['@_type'];
    const isNull = param['@_is_null'] === true;

    if (isNull) {
      output[name] = null;
    } else if (param['@_int_val'] !== undefined) {
      output[name] = parseInt(param['@_int_val'], 10);
    } else if (param['@_float_val'] !== undefined) {
      output[name] = parseFloat(param['@_float_val']);
    } else if (param['@_bool_val'] !== undefined) {
      output[name] = param['@_bool_val'] === true;
    } else {
      output[name] = param['#text'] ?? '';
    }
  }
 // if (result.object['@_typename'] && result.object['@_typename'] !== "object" && result.object['@_typename'] !== "Object") {
    output.typename = result.object['@_typename'];
//  } else if(result.object['@_typename'] === "object" || result.object['@_typename'] === "Object"){
//    output.typename = result.object['tagName'] ??  result.object['@_tagName'] ?? result.object['tag'] ?? result.object.tag}

  return output;
}

export interface new_ParsedJson {
  [key: string]: string | number | boolean | null | new_ParsedJson[] | new_ParsedJson;
}



export function new_parseSoapXmlToJson<T = any | any[]>(soapXml: string,datanode?:string): T {
 // Nettoyer les caractères non valides
 //soapXml = soapXml.replace(/[«»]/g, '"');

 const parser = new DOMParser();
 const doc = parser.parseFromString(soapXml, 'application/xml');

 const root:HTMLElement = doc?.documentElement;

 if (!root) throw new Error('Aucune racine XML trouvée');
 const decoded =root?.textContent ? root.textContent
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>')
 .replace(/&amp;/g, '&')
 .replace(/\\</g, '<')
 .replace(/\\>/g, '>')
 .replace(/\\\//g, '/')
 .replace(/\\"/g, '"')
 .replace(/\\\\/g, '\\')
 .replace(/&gt;/g, '>')
 .replace(/&lt;/g, '<') : root.textContent
console.log(" ROOT decoded element ======="+decoded)
 // Cas 1 : <objects><object>...</object></objects>
 const objdecoded = parser.parseFromString(decoded??"", 'application/xml');
 const objectsNode = objdecoded.getElementsByTagName('objects')[0];
 if (objectsNode) {
   const objectNodes = Array.from(objectsNode.getElementsByTagName('object'));
   const results = objectNodes.map(parseXmlObjectNode);
   return results as T;
 }

 // Cas 2 : <object> unique
 const singleObject = objdecoded.getElementsByTagName('object')[0];
 if (singleObject) {
   return parseXmlObjectNode(singleObject) as T;
 }

 throw new Error('Aucun <object> trouvé dans le XML');
}

function parseXmlObjectNode(objectNode: Element): new_ParsedJson {
  const result: new_ParsedJson = {};

  // ✅ Extraire typename
  const typename = objectNode.getAttribute('typename');
  if (typename) {
    result.typename = typename;
  }

  // ✅ Extraire <param>
  const paramNodes = Array.from(objectNode.getElementsByTagName('param'));
  for (const param of paramNodes) {
    const name = param.getAttribute('name');
    if (!name) continue;

    const isNull = param.getAttribute('is_null') === 'true';
    const intVal = param.getAttribute('int_val');
    const floatVal = param.getAttribute('float_val');
    const boolVal = param.getAttribute('bool_val');
    const text = param.textContent?.trim();

    if (isNull) {
      result[name] = null;
    } else if (intVal !== null) {
      result[name] = parseInt(intVal, 10);
    } else if (floatVal !== null) {
      result[name] = parseFloat(floatVal);
    } else if (boolVal !== null) {
      result[name] = boolVal === 'true';
    } else {
      result[name] = text || '';
    }
  }

  // ✅ Extraire les sous-sections imbriquées (ex: <qint><objects>...</objects></qint>)
  const childNodes = Array.from(objectNode.childNodes).filter(
    (n) => n.nodeType === 1 && n.nodeName !== 'param' // uniquement <qint>, <xtlog>, etc.
  ) as Element[];

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

function parseNestedObject(node: any): new_ParsedJson {
  const output: new_ParsedJson = {};

  // ➤ Extraire les <param>
  if (node.param) {
    const params = Array.isArray(node.param) ? node.param : [node.param];
    for (const param of params) {
      const name = param['@_name'];
      if (!name) continue;

      if (param['@_is_null']) {
        output[name] = null;
      } else if (param['@_int_val'] !== undefined) {
        output[name] = parseInt(param['@_int_val'], 10);
      } else if (param['@_float_val'] !== undefined) {
        output[name] = parseFloat(param['@_float_val']);
      } else if (param['@_bool_val'] !== undefined) {
        output[name] = param['@_bool_val'] === true || param['@_bool_val'] === 'true';
      } else if (typeof param['#text'] === 'string') {
        output[name] = param['#text'];
      } else {
        output[name] = '';
      }
    }
  }

  // ➤ Ajouter le typename
  if (node['@_typename']) {
    output.typename = node['@_typename'];
  }

  // ➤ Gérer les sous-collections (ex: <qint><objects><object>...</object></objects>)
  for (const [key, value] of Object.entries(node)) {
    if (['param', '@_typename'].includes(key)) continue;

    const sub = value as any;

    if (sub?.objects?.object) {
      const subObjects = Array.isArray(sub.objects.object)
        ? sub.objects.object
        : [sub.objects.object];

      output[capitalize(key)] = subObjects.map(parseNestedObject);
    } else if (sub?.object) {
      const subObjects = Array.isArray(sub.object)
        ? sub.object
        : [sub.object];

      output[capitalize(key)] = subObjects.map(parseNestedObject);
    }
  }

  return output;
}

function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}


function parseFastXmlObject(obj: any): new_ParsedJson {
  const params = Array.isArray(obj.param) ? obj.param : [obj.param];
  const output: new_ParsedJson = {};

  for (const param of params) {
    const name = param['@_name'];
    if (!name) continue;

    if (param['@_is_null'] === true || param['@_is_null'] === 'true') {
      output[name] = null;
    } else if (param['@_int_val'] !== undefined) {
      output[name] = parseInt(param['@_int_val'], 10);
    } else if (param['@_float_val'] !== undefined) {
      output[name] = parseFloat(param['@_float_val']);
    } else if (param['@_bool_val'] !== undefined) {
      output[name] = param['@_bool_val'] === true || param['@_bool_val'] === 'true';
    } else if (typeof param['#text'] === 'string') {
      output[name] = param['#text'];
    } else {
      output[name] = '';
    }
  }

  return output;
}


function mergeObjectsFromNodes(nodes: Element[]): new_ParsedJson {
  const result: new_ParsedJson = {};
  for (const node of nodes) {
    const parsed = new_parseObjectXmlToJson(serializeXmlElement(node));
    Object.assign(result, parsed);
  }
  return result;
}

function serializeXmlElement(element: Element): string {
  return new XMLSerializer().serializeToString(element);
}

export function new_parseObjectXmlToJson(xml: string): new_ParsedJson {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseAttributeValue: true,
    trimValues: true
  });

  const parsed = parser.parse(xml);
  const obj = parsed?.object;

  if (!obj || !obj.param) {
    return {}; // aucune donnée utile
  }

  const params = Array.isArray(obj.param) ? obj.param : [obj.param];

  const output: new_ParsedJson = {};

  for (const param of params) {
    const name = param['@_name'];
    if (!name) continue;

    if (param['@_is_null'] === true || param['@_is_null'] === 'true') {
      output[name] = null;
    } else if (param['@_int_val'] !== undefined) {
      output[name] = parseInt(param['@_int_val'], 10);
    } else if (param['@_float_val'] !== undefined) {
      output[name] = parseFloat(param['@_float_val']);
    } else if (param['@_bool_val'] !== undefined) {
      output[name] = param['@_bool_val'] === true || param['@_bool_val'] === 'true';
    } else if (typeof param['#text'] === 'string') {
      output[name] = param['#text'];
    } else {
      output[name] = '';
    }
  }

  return output;
}


