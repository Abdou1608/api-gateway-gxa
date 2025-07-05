"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXml = parseXml;
const xml2js_1 = require("xml2js");
async function parseXml(xml) {
    return await (0, xml2js_1.parseStringPromise)(xml, { explicitArray: false });
}
