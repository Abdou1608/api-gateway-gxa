import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function quittance_create(contrat:any,piece:any,bordereau:any,effet:any,data:any, bass:BasSecurityContext) {

  const params=new BasParams()
 params.AddStr("BasSecurityContext", bass.ToSoapVar())
    params.AddInt("contrat", contrat)
    params.AddInt("piece", piece)
    params.AddInt("bordereau", bordereau)
  params.AddDateTime("effet", effet) 
    params.AddStr("data", data)

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
  const result = await sendSoapRequest(params, 'Quittance_Create', bass);
  return result;
}