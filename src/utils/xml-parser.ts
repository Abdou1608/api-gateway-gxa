import { parseStringPromise } from 'xml2js';
import { create } from 'xmlbuilder2';
export async function parseXml(xml: string): Promise<any> {
  return await parseStringPromise(xml, { explicitArray: false });
}

/**
 * Transforme un objet JavaScript en flux XML enveloppé dans une balise <Data>,
 * sans inclure la déclaration XML.
 *
 * @param data - L'objet contenant plusieurs sous-objets à convertir en XML.
 * @returns Un flux XML sous forme de chaîne de caractères.
 */
export function objectToXML(data: Record<string, any>): string {
  const root = create().ele('Data');

  function buildXml(parent: any, obj: Record<string, any>) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        parent.ele(key).att('xsi:nil', 'true');
      } else if (Array.isArray(value)) {
        const arrayParent = parent.ele(key);
        value.forEach((item) => {
          const itemElem = arrayParent.ele('item');
          if (typeof item === 'object') {
            buildXml(itemElem, item);
          } else {
            itemElem.txt(String(item));
          }
        });
      } else if (typeof value === 'object') {
        const child = parent.ele(key);
        buildXml(child, value);
      } else if (typeof value === 'boolean') {
        parent.ele(key).att('type', 'boolean').txt(value ? 'true' : 'false');
      } else if (typeof value === 'number') {
        parent.ele(key).att('type', Number.isInteger(value) ? 'integer' : 'float').txt(String(value));
      } else {
        parent.ele(key).att('type', 'string').txt(value);
      }
    });
  }

  buildXml(root, data);

  return root.end({ prettyPrint: true, headless: true });
}