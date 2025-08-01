"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXml = parseXml;
exports.objectToXML = objectToXML;
const xml2js_1 = require("xml2js");
const xmlbuilder2_1 = require("xmlbuilder2");
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
function objectToXML(data) {
    const root = (0, xmlbuilder2_1.create)().ele('Data');
    function buildXml(parent, obj) {
        Object.entries(obj).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                parent.ele(key).att('xsi:nil', 'true');
            }
            else if (Array.isArray(value)) {
                const arrayParent = parent.ele(key);
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
                const child = parent.ele(key);
                buildXml(child, value);
            }
            else if (typeof value === 'boolean') {
                parent.ele(key).att('type', 'boolean').txt(value ? 'true' : 'false');
            }
            else if (typeof value === 'number') {
                parent.ele(key).att('type', Number.isInteger(value) ? 'integer' : 'float').txt(String(value));
            }
            else {
                parent.ele(key).att('type', 'string').txt(value);
            }
        });
    }
    buildXml(root, data);
    return root.end({ prettyPrint: true, headless: true });
}
