import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { sendSoapRequest } from "../soap.service";


export async function quittance_create(contrat: number,
piece:number,
bordereau:number,effet?:Date,  data? : any, BasSecurityContext?:any,) {

  const params=new BasParams()
  BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
    params.AddInt("contrat",contrat)
    params.AddInt("piece",piece)
    params.AddInt("bordereau",bordereau)
    effet ? params.AddDateTime("effet",effet) : null
    data ? params.AddStr("data",data) : null

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
  const result = await sendSoapRequest(params, 'Quittance_Create',BasSecurityContext);
  return result;
}