"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_search = cont_search;
const soap_service_1 = require("../soap.service");
async function cont_search(reference, detailorigine, origine, codefic, nomchamp, BasSecurityContext) {
    const soapBody = { reference, detailorigine, origine, codefic, nomchamp, BasSecurityContext };
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
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Cont_Search", BasSecurityContext);
    return result;
}
