import { XMLParser } from 'fast-xml-parser';
import { DOMParser } from 'xmldom';
import { DOMImplementation, XMLSerializer } from 'xmldom';
import { Produit } from '../Model/produit.model';
export interface XmlParsedObject {
  [key: string]: string | number | boolean | null | XmlParsedObject | XmlParsedObject[];
}
import { parseStringPromise } from 'xml2js';

interface Param {
  name: string;
  type?: string;
  int_val?: string;
  bool_val?: string;
  float_val?: string;
  is_null?: string;
  _: string;
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
 
  try {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(soapXml, 'application/xml');
  //console.log("La valeur de  soapXml est ========"+ soapXml)
const dname:string=datanode ? datanode+'-rows':""
console.log("La valeur de  dname est ========"+ dname)
  let dataNode = doc.getElementsByTagName(datanode || 'Data' || 'data')[0];
  
  
  if (!dataNode || !dataNode.textContent) {
     dataNode =  doc.getElementsByTagName(dname)[0];
     
     if (!dataNode ) {
      console.log(' Ou <Data> introuvable dans la réponse SOAP')
      //return parseProdSoapResponse()
    throw new Error('dataNode est inexistant dans la réponse SOAP oui Session utilisateur non valide');
     } else if(!dataNode.textContent){
      console.log('dataNode.textContent est inexistant dans la réponse SOAP')
      console.log('Le contenue de dataNode est-----'+ serializer.serializeToString(dataNode))
    
      throw new Error(dname+' dataNode.textContent introuvable dans la réponse SOAP oui Session utilisateur non valide');
    
     }
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
   console.log("**********La valeur de decoded est ========"+decoded)
  const innerXml = parser.parseFromString(decoded, 'application/xml');
  const root = innerXml.documentElement;
  let isList=false
  let _dn=0
  if (datanode && datanode !== ""){
    const nodes = root.getElementsByTagName(datanode || 'Data' || dname || 'data') ;
    const node = nodes[0];
    isList = node ? node.nodeName.toLowerCase().endsWith('s') : false;
    _dn=1
  } else {
    isList = root.tagName.toLowerCase().endsWith('s');
    _dn=2
  }
  
  console.log("La valeur de isList est ========"+isList)
  console.log("La valeur de _dn est ========"+_dn)
  const tagname =datanode ?? ""
  let rawNodes = root.getElementsByTagName('object') 
  rawNodes = rawNodes ?? root.getElementsByTagName(tagname);
 
  console.log("La valeur de rawNodes[0]  est ========"+rawNodes[0] )
  console.log("La Longueur de rawNodes  est ========"+rawNodes.length )
  // On vérifie explicitement la présence d'au moins un objet
  let objectNodes: Element[] = [];
 
  if (isList || rawNodes.length > 0) {
    objectNodes = Array.from(rawNodes); // plusieurs objets
    console.log("Nombre d'objets trouvés est ----: "+rawNodes.length)
    if (objectNodes.length === 0) {
      throw new Error("Aucun élément <object> trouvé dans le XML et Datanode ="+datanode);
    }
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
 
  
  /* On mappe uniquement des nœuds valides
  const parsed = objectNodes.map((node) => node.textContent? parseObjectXmlToJson(node.textContent) : null);
  console.log("RESULTA DE arseSoapXmlToJson. PARSED....."+JSON.stringify(parsed))
  const result = parsed.length > 1 ? parsed : parsed[0];
// console.log("RESULTA DE arseSoapXmlToJson. result....."+JSON.stringify(result))
  return result as T;
  */
} catch (error:any) {
  throw new Error(error.message)
}
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
export async function parseProdSoapResponse(xmlString: string): Promise<any> {
  const produits: Produit[] = [];
  console.log(":===============================================================================================================================")
  console.log(":===============================================================================================================================")
  console.log(":===============================================================================================================================")

 // console.log('xmlString dans parseSoapResponse=.....'+ xmlString)
  const _xmlContent = xmlString
  .replace(/\\</g, '<')
  .replace(/\\>/g, '>')
  .replace(/\\\//g, '/')
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\')
  .replace('&gt;', '>')
  .replace('&lt;', '<')
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&amp;/g, '&');  
  console.log('_xmlContent dans parseSoapResponse=.....'+ _xmlContent)  
  const rawContentMatch = _xmlContent.match(/<prod-rows[^>]*>([\s\S]*?)<\/prod-rows>/);
 //const detail_rawContentMatch = _xmlContent.match(/<produit[^>]*>([\s\S]*?)<\/produit>/);
  //console.log("rawContentMatch ========"+rawContentMatch)

  if (rawContentMatch ){
   // console.log("_xmlContent ========"+_xmlContent)
    //return produits
//throw new Error('rawContentMatch et detail_rawContentMatch sont inexistant dans la réponse SOAP');
  return parseprod_content(rawContentMatch[0],produits)
  }else if(_xmlContent){
    return await parse_Produit_SoapXml(_xmlContent)
    // parseprod_content(detail_rawContentMatch[0],produits)
  }else {
    throw new Error('rawContentMatch et detail_rawContentMatch sont inexistant dans la réponse SOAP');


  };
  

}

 function parseprod_content(content:string, produits:any){

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');

  const prodElements = xmlDoc.getElementsByTagName('prod');

console.log(":===============================================================================================================================")

console.log('£££££prodElements.length  =.....'+prodElements.length)


  for (let i = 0; i < prodElements.length; i++) {
    const prod = prodElements[i];
    const produit: Produit = get_prod(prod)
console.log('Produit extrait et reconstituee  =.....'+produit.codeprod)
    produits.push(produit);
  }
if(produits.length > 1){
   return produits as Produit[];
}else {
  return produits[0] as Produit
}
 
}
function get_prod(prod:Element){
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
    ole: getTagValue('b_ole'),
    typarro: getTagValue('b_typarro'),
    fvahom: getTagValue('b_fvahom'),
  };

}
export async function parse_Produit_SoapXml(xml: string): Promise<Produit> {
  try {
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      mergeAttrs: true,
      tagNameProcessors: [name => name.replace('SOAP-ENV:', '').replace('NS1:', '').replace('NS2:', '')],
    });

    const dataXml = parsed.Envelope?.Body?.BasActionResult?.Data;
    if (!dataXml) throw new Error('No <Data> field found in SOAP response');

    const embeddedXml = typeof dataXml === 'string' ? dataXml.trim() : dataXml._?.trim();
    if (!embeddedXml) throw new Error('No embedded XML in <Data> field');

    const innerParsed = await parseStringPromise(embeddedXml, {
      explicitArray: false,
      mergeAttrs: true,
    });

    const params: Param[] = innerParsed.produit?.object?.param;
    if (!params || !Array.isArray(params)) throw new Error('No <param> tags found in embedded XML');

    const result: Record<string, any> = {};
    for (const param of params) {
      if (param.is_null === 'true') {
        result[param.name] = null;
      } else if (param.bool_val !== undefined) {
        result[param.name] = param.bool_val === 'true';
      } else if (param.int_val !== undefined) {
        result[param.name] = parseInt(param.int_val, 10);
      } else if (param.float_val !== undefined) {
        result[param.name] = parseFloat(param.float_val);
      } else if (typeof param._ === 'string') {
        result[param.name] = param._.trim();
      } else {
        result[param.name] = '';
      }
    }

    return result as Produit;
  } catch (error) {
    console.error('SOAP XML parsing failed:', error);
    throw new Error('Invalid SOAP response or unexpected structure');
  }
}




