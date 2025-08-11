"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXml = parseXml;
exports.objectToXML = objectToXML;
exports.objectToCustomXML = objectToCustomXML;
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
function objectToCustomXML(data, _root) {
    const root = (0, xmlbuilder2_1.create)().ele(_root).ele('input').ele('objects');
    function getXMLTypeAndValue(value) {
        if (value === null || value === undefined) {
            return { type: 'ptUnknown', valueAttr: 'is_null="true"' };
        }
        switch (typeof value) {
            case 'boolean':
                return { type: 'ptBool', valueAttr: `bool_val="${value}"` };
            case 'number':
                if (Number.isInteger(value))
                    return { type: 'ptInt', valueAttr: `int_val="${value}"` };
                else
                    return { type: 'ptFloat', valueAttr: `float_val="${value.toExponential(14).replace('e', 'E')}"` };
            case 'string':
                // Vérifie si c'est une date ISO valide
                if (!isNaN(Date.parse(value))) {
                    const dateValue = new Date(value).toISOString();
                    return { type: 'ptDateTime', valueAttr: `date_val="${dateValue}"` };
                }
                else {
                    return { type: 'ptString', valueAttr: '', value };
                }
            default:
                return { type: 'ptUnknown', valueAttr: 'is_null="true"' };
        }
    }
    for (const objectName in data) {
        const objectData = data[objectName];
        if (typeof objectData === 'object') {
            const objectElem = root.ele('object').att('typename', objectName.toUpperCase());
            for (const paramName in objectData) {
                const paramValue = objectData[paramName];
                const { type, valueAttr, value } = getXMLTypeAndValue(paramValue);
                const paramElem = objectElem.ele('param')
                    .att('name', paramName)
                    .att('type', type);
                if (valueAttr)
                    paramElem.att(valueAttr.split('=')[0], valueAttr.split('=')[1].replace(/"/g, ''));
                if (value !== undefined && type === 'ptString')
                    paramElem.txt(value);
            }
        }
        else {
            const { type, valueAttr, value } = getXMLTypeAndValue(objectData);
            const paramElem = root.ele('param')
                .att('name', objectName)
                .att('type', type);
            if (valueAttr)
                paramElem.att(valueAttr.split('=')[0], valueAttr.split('=')[1].replace(/"/g, ''));
            if (value !== undefined && type === 'ptString')
                paramElem.txt(value);
        }
    }
    return root.end({ prettyPrint: true, headless: true });
}
