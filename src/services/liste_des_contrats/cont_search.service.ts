import { sendSoapRequest } from "../soap.service";


export async function cont_search(reference?:string,detailorigine?:boolean,
 origine?:any,
codefic?:string,nomchamp?: string, BasSecurityContext?:any) {
  const soapBody={reference,detailorigine,origine,codefic,nomchamp, BasSecurityContext};
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
  const result = await sendSoapRequest(soapBody,"Cont_Search",BasSecurityContext);
  return result;
}