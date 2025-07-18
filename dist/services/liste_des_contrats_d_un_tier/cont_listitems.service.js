"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont_listitems = cont_listitems;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const soap_service_1 = require("../soap.service");
async function cont_listitems(dossier, includeall, defaut, BasSecurityContext) {
    defaut = true;
    const soapBody = { dossier, includeall, defaut, BasSecurityContext };
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", BasSecurityContext.ToSoapVar());
    params.AddInt("dossier", dossier);
    // params.AddBool("composition",composition ?? false) 
    params.AddBool("includeall", includeall);
    params.AddBool("defaut", defaut ?? false);
    //params.AddString("ListeEntites","CLI, SAL,DPP")
    params.AddString("datanode", "Tiers");
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
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Cont_ListItems", BasSecurityContext);
    return result;
}
