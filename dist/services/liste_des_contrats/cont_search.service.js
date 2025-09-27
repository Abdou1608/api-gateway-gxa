"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_search = cont_search;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const groupByTypename_1 = __importDefault(require("../../utils/groupByTypename"));
const soap_service_1 = require("../soap.service");
async function cont_search(reference, detailorigine, origine, codefic, nomchamp, BasSecurityContext) {
    const soapBody = { reference, detailorigine, origine, codefic, nomchamp, BasSecurityContext };
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddString("reference", reference);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("detailorigine", detailorigine);
    params.AddString("origine", origine);
    params.AddString("codefic", codefic);
    params.AddString("nomchamp", nomchamp);
    //params.AddString("ListeEntites","CLI, SAL,DPP")
    params.AddString("datanode", "Tiers");
    /*
    `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:Cont_Search>
            <reference>${reference}</reference>
  <detailorigine>${detailorigine}
  </detailorigine>
  <origine>${origine}</origine>
  <codefic>${codefic}</codefic>
  <nomchamp>${nomchamp}</nomchamp>
          </tem:Cont_Search>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  */
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_Search", BasSecurityContext, "Conts");
    const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
    return grouped;
    return result;
}
