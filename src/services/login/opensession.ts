import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { AuthenticationHelper} from '../../Model/Model-BasAuth/BasAuthHelper'
import { AppConfigService } from "../AppConfigService/app-config.service";

import { BasSoapClient } from "../../Model/Model-BasSoapClient/BasSoapClient";
import { SessionStorage } from '../../Model/Model-SessionStorage/SessionStorage';

export async function opensession(logon: string, password: string, domain?: string) {
  try {
    
  console.log("Début API opensession service avec les paramètres logon=="+logon+" password=="+password+" domain=="+domain)
    const params=new BasParams()
    params.AddString("logon",logon)
     params.AddString("password",password)
     params.AddString("domain",domain? domain :"") 
     let sessionStorage = new SessionStorage()
     const basSoapClient= new BasSoapClient()
     const appc= new AppConfigService()
const auth = new AuthenticationHelper(sessionStorage,basSoapClient, appc)
  const result = await  auth.AuthenticateUser(logon,password,domain);
  console.log("!!!!!!!!Result opensession service=="+JSON.stringify( result))
  return result;

}   catch (error:any) {
  console.log("Erreur dans API dans opensession service=="+JSON.stringify( error))
  throw( error);

}
}