import { AuthenticationHelper } from "../../Model/Model-BasAuth/BasAuthHelper";
import { BasSoapClient } from "../../Model/Model-BasSoapClient/BasSoapClient";
import { SessionStorage } from "../../Model/Model-SessionStorage/SessionStorage";
import { AppConfigService } from "../AppConfigService/app-config.service";


export async function closesession_(bassecuritycontext: string) {

  let sessionStorage = new SessionStorage()
  const basSoapClient= new BasSoapClient()
  const appc= new AppConfigService()

  const auth = new AuthenticationHelper(sessionStorage,basSoapClient, appc)
  const result = await auth.LogOut();
  return result;
}