
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from '../soap.service';
import { Xtlog } from '../..//Model/xtlog.model';



export async function xtlog_search(
  BasSecurityContext: BasSecurityContext,
  username: string,
  domain: string,
  ctx?: { userId?: string; domain?: string; password?: string }
) {
  const params=new BasParams()
  params.AddStr("BasSecurityContext",BasSecurityContext.ToSoapVar())
   params.AddString("login",username)
   params.AddString("domain",domain) 
   params.AddString("datanode","xtlog")
  const result = await sendSoapRequest(
    params,
    "Xtlog_Get",
    BasSecurityContext,
    undefined,
    undefined,
    ctx
  ).then(a => { return a as Xtlog});
  return result;
}