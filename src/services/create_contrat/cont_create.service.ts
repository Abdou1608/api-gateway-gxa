import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { ContModel } from '../../Model/create_update_contrat';
import groupByTypename from '../../utils/groupByTypename';
import { cont_details } from '../detail_contrat/cont_details.service';
import { sendSoapRequest } from '../soap.service';
import { contModelToXml } from './cont_to_xml.service';


export async function cont_create(
  dossier: number,
  produit?: string,
  effet?: string,
  data?: any,
  BasSecurityContext?: any,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
    const params=new BasParams()
    BasSecurityContext? params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar()):null
 
    params.AddInt("dossier",dossier)
    produit ? params.AddString("produit",produit) : null
    effet ? params.AddStrDate("effet",new Date(effet).toISOString().split('T')[0]) : params.AddStrDate("effet",new Date().toISOString().split('T')[0])

 // data ? params.AddStr("data",contModelToXml(data)) :null
  console.log("££££££££===========DATA"+JSON.stringify( data))
  const result = await sendSoapRequest(
    params,
    "Cont_Create",
    BasSecurityContext,
    "cont",
    data,
    ctx
  );
 // console.log("$$$$$$$$$ RESULT CREATE CONTRAT "+JSON.stringify(result))
  if (!result?.error ) {
    const resultData = result["piec"];
  //  console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT Objet"+JSON.stringify(resultData))
 //  console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT  "+(resultData.contrat))
    if (!resultData) {
      console.error("No data in response");
      return { error: "No data in response" };
    }
    const contCreateResult = await cont_details(
      { contrat: resultData.contrat },
      BasSecurityContext
    );
    console.log("$$$$$$$$$ RESULT DATA CREATE CONTRAT  contCreateResult==="+JSON.stringify(contCreateResult))
    return contCreateResult;
   //  const grouped = groupByTypename(contCreateResult, { keepUnknown: true });
    //  return grouped;
  }else{
    return result
  }
}