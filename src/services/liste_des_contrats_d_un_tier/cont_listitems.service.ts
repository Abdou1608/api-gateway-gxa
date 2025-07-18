import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import { sendSoapRequest } from "../soap.service";


export async function cont_listitems(dossier: number,includeall:boolean, defaut:boolean,BasSecurityContext:BasSecurityContext) {
 defaut=true
  const soapBody ={dossier,includeall,defaut,BasSecurityContext}
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddInt("dossier",dossier)
  // params.AddBool("composition",composition ?? false) 
  params.AddBool("includeall",includeall)
   params.AddBool("defaut",defaut ?? false) 
   //params.AddString("ListeEntites","CLI, SAL,DPP")
   params.AddString("datanode","Tiers")
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

  const result = await sendSoapRequest(params,"Cont_ListItems",BasSecurityContext);
  return result;
}