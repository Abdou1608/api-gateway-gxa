import { parseStringPromise } from 'xml2js';

export async function parseXml(xml: string): Promise<any> {
  return await parseStringPromise(xml, { explicitArray: false });
}
