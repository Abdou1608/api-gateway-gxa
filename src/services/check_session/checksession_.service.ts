import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { sendSoapRequest } from '../soap.service';


export async function checksession_(bassecuritycontext: string) {
  const params=new BasParams()
  params.AddString("bassecuritycontext",bassecuritycontext)
  const result = await sendSoapRequest(params,"checksession");
  return result;
}