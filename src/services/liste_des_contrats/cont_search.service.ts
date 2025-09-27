import { BasParams } from "../../Model/BasSoapObject/BasParams";
import { BasSecurityContext } from "../../Model/BasSoapObject/BasSecurityContext";
import groupByTypename from "../../utils/groupByTypename";
import { sendSoapRequest } from "../soap.service";


export async function cont_search(reference:string,detailorigine:boolean,
 origine:any,
codefic:string,nomchamp: string, BasSecurityContext:BasSecurityContext) {
  const soapBody={reference,detailorigine,origine,codefic,nomchamp, BasSecurityContext};
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("reference",reference)
  // params.AddBool("composition",composition ?? false) 
  params.AddBool("detailorigine",detailorigine)
   params.AddString("origine",origine) 
   params.AddString("codefic",codefic) 
   params.AddString("nomchamp",nomchamp) 
   //params.AddString("ListeEntites","CLI, SAL,DPP")
   params.AddString("datanode","Tiers")
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
  const result = await sendSoapRequest(params,"Cont_Search",BasSecurityContext, "Conts");
  const grouped = groupByTypename(result, { keepUnknown: true });
  return grouped;
  return result;
}