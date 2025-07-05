"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opensession_xtlog_login_non_fonctionnel_ = opensession_xtlog_login_non_fonctionnel_;
const soap_service_1 = require("../../soap/soap.service");
async function opensession_xtlog_login_non_fonctionnel_(logon, password, domain) {
    const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tem:OpenSession>
          <logon>${logon}</logon>
<password>${password}</password>
<domain>${domain}</domain>
        </tem:OpenSession>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
    const result = await (0, soap_service_1.sendSoapRequest)(soapBody);
    return result;
}
