import { domain } from 'zod/v4/core/regexes.cjs';
import { BasParams } from '../../Model/BasSoapObject/BasParams';
import { BasSecurityContext } from '../../Model/BasSoapObject/BasSecurityContext';
import { AuthenticationHelper } from '../../Model/Model-BasAuth/BasAuthHelper';
import { BasSoapClient } from '../../Model/Model-BasSoapClient/BasSoapClient';
import { SessionStorage } from '../../Model/Model-SessionStorage/SessionStorage';
import { AppConfigService } from '../AppConfigService/app-config.service';
import { sendSoapRequest } from '../soap.service';


export async function checksession_(bassecuritycontext: BasSecurityContext) {
  let sessionStorage = new SessionStorage()
       const basSoapClient= new BasSoapClient()
       const appc= new AppConfigService()
  const auth = new AuthenticationHelper(sessionStorage,basSoapClient, appc)
    const result = await  auth.CheckSession(bassecuritycontext);
    console.log("!!!!!!!!Result CheckSession  service=="+JSON.stringify( result))
    return result;
}