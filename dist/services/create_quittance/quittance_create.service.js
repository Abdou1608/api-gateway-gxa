"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quittance_create = quittance_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function quittance_create(body) {
    const params = new BasParams_1.BasParams();
    body.BasSecurityContext ? params.AddStr("BasSecurityContext", body.BasSecurityContext.ToSoapVar()) : null;
    params.AddInt("contrat", body.contrat);
    params.AddInt("piece", body.piece);
    params.AddInt("bordereau", body.bordereau);
    body.effet ? params.AddDateTime("effet", body.effet) : null;
    body.data ? params.AddStr("data", body.data) : null;
    /*
    `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:Quittance_Create>
            <contrat (int>${contrat (int}</contrat (int>
  <obligatoire) : numéro interne du contrat cible
  piece (int>${obligatoire) : numéro interne du contrat cible
  piece (int}</obligatoire) : numéro interne du contrat cible
  piece (int>
  <obligatoire) : numéro de la piece du contrat cible
  bordereau (int>${obligatoire) : numéro de la piece du contrat cible
  bordereau (int}</obligatoire) : numéro de la piece du contrat cible
  bordereau (int>
  <obligatoire) : numéro du bordereau cible  data : flux xml de toutes les informations de la quittance à crée>${obligatoire) : numéro du bordereau cible  data : flux xml de toutes les informations de la quittance à crée}</obligatoire) : numéro du bordereau cible  data : flux xml de toutes les informations de la quittance à crée>
          </tem:Quittance_Create>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  */
    const result = await (0, soap_service_1.sendSoapRequest)(params, 'Quittance_Create', body.BasSecurityContext);
    return result;
}
