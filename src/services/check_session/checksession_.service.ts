import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';


export async function checksession_(bassecuritycontext: BasSecurityContext) {
  const params=new BasParams()
  params.AddString("BasSecuritycontext",bassecuritycontext.ToSoapVar())
  params.AddString("basSecuritycontext",bassecuritycontext.ToSoapVar())
  const result = await sendSoapRequest(params,"checksession");
  return result;
}