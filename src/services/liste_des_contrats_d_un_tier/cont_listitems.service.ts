import { sendSoapRequest } from "../soap.service";


export async function cont_listitems(dossier: number,includeall?:boolean, defaut?:boolean,BasSecurityContext?:any) {
 defaut=true
  const soapBody ={dossier,includeall,defaut,BasSecurityContext}
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

  const result = await sendSoapRequest(soapBody,"Cont_ListItems",BasSecurityContext);
  return result;
}