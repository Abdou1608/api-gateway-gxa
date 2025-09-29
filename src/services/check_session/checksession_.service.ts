import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { sendSoapRequest } from '../soap.service';


export async function checksession_(bassecuritycontext: BasSecurityContext) {
  const params=new BasParams()
   bassecuritycontext? params.AddStr("BasSecurityContext",bassecuritycontext.ToSoapVar()):null
    const result = await sendSoapRequest(params,"CheckSession", bassecuritycontext);
  return result;
}