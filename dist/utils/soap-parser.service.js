"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSoapXmlToJson = parseSoapXmlToJson;
exports.parseObjectXmlToJson = parseObjectXmlToJson;
const fast_xml_parser_1 = require("fast-xml-parser");
const xmldom_1 = require("xmldom");
const xmldom_2 = require("xmldom");
const parser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: true,
    parseAttributeValue: true,
});
//* Parse une réponse SOAP XML contenant un champ <Data> encodé.
function parseSoapXmlToJson(soapXml, datanode) {
    const parser = new xmldom_1.DOMParser();
    const doc = parser.parseFromString(soapXml, 'application/xml');
    const dataNode = doc.getElementsByTagName(datanode || 'Data' || 'rows_' + datanode || 'data')[0];
    if (!dataNode || !dataNode.textContent) {
        throw new Error(datanode + ' Ou <objects> introuvable dans la réponse SOAP');
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
    console.log("La valeur de decoded est ========" + decoded);
    const innerXml = parser.parseFromString(decoded, 'application/xml');
    const root = innerXml.documentElement;
    let isList = false;
    if (datanode && datanode !== "") {
        const nodes = root.getElementsByTagName(datanode);
        const node = nodes[0];
        isList = node ? node.nodeName.toLowerCase().endsWith('s') : false;
    }
    else {
        isList = root.tagName.toLowerCase().endsWith('s');
    }
    console.log("La valeur de isList est ========" + isList);
    const rawNodes = root.getElementsByTagName('object');
    console.log("La valeur de rawNodes  est ========" + rawNodes);
    console.log("La valeur de rawNodes[0]  est ========" + rawNodes[0]);
    // On vérifie explicitement la présence d'au moins un objet
    let objectNodes = [];
    const serializer = new xmldom_2.XMLSerializer();
    if (isList || rawNodes.length > 0) {
        objectNodes = Array.from(rawNodes); // plusieurs objets
        console.log("plusieurs objets trouvés");
        return objectNodes.map((node) => {
            const xmlString = serializer.serializeToString(node);
            const result = parseObjectXmlToJson(xmlString);
            return result;
        });
    }
    else {
        // objectNodes.push(rawNodes[0]); // un seul objet
        console.log("La valeur de rawNodes[0].textcontent  est ========" + rawNodes[0].textContent);
        const xmlString = serializer.serializeToString(rawNodes[0]);
        const result = xmlString ?? "";
        return parseObjectXmlToJson(result);
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
function parseObjectXmlToJson(xml) {
    const parser = new fast_xml_parser_1.XMLParser({
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
    const output = {};
    for (const param of paramNodes) {
        const name = param['@_name'];
        const type = param['@_type'];
        const isNull = param['@_is_null'] === true;
        if (isNull) {
            output[name] = null;
        }
        else if (param['@_int_val'] !== undefined) {
            output[name] = parseInt(param['@_int_val'], 10);
        }
        else if (param['@_float_val'] !== undefined) {
            output[name] = parseFloat(param['@_float_val']);
        }
        else if (param['@_bool_val'] !== undefined) {
            output[name] = param['@_bool_val'] === true;
        }
        else {
            output[name] = param['#text'] ?? '';
        }
    }
    return output;
}
