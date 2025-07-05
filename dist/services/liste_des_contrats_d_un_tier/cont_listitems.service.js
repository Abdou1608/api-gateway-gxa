"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_listitems = cont_listitems;
const soap_service_1 = require("../soap.service");
async function cont_listitems(dossier, includeall, defaut, BasSecurityContext) {
    defaut = true;
    const soapBody = { dossier, includeall, defaut, BasSecurityContext };
    /*
    `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:Cont_ListItems>
            <dossier>${dossier}</dossier>
            <includeall>${includeall}</includeall>
            <defaut>${defaut}</defaut>
    </tem:Cont_ListItems>
        </soapenv:Body>
      </soapenv:Envelope>
    `
    */
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody, "Cont_ListItems", BasSecurityContext);
    return result;
}
