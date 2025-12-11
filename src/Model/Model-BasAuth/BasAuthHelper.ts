//import { HttpClient } from "express";
import { AppConfigService } from "../../services/AppConfigService/app-config.service";
import { BasSecurityContext } from "../BasSoapObject/BasSecurityContext";
import { BasSoapClient } from "../Model-BasSoapClient/BasSoapClient";
import { SessionStorage } from "../Model-SessionStorage/SessionStorage";
import { BasAuth } from "./BasAuth";

export class AuthenticationHelper {

    private basSecurityContext!: BasSecurityContext;
    private basAuth: BasAuth;
  
    constructor(private sessionStorage: SessionStorage, private basSoapClient: BasSoapClient, private appConfigService: AppConfigService) {
      this.basAuth = new BasAuth(this.basSoapClient, this.appConfigService);
    }
  
    //Method for performing basic authentication and fetch token and save in session model
  public async AuthenticateUser(userName: string, password: string, domain?: string): Promise<BasSecurityContext> {
      this.basSecurityContext = await this.basAuth.OpenSession(userName, password, domain);
    console.log("!!!!!!!!!!!!!!! basSecurityContext AuthenticateUser: "+JSON.stringify(this.basSecurityContext));
    return this.basSecurityContext;
    
     this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
      this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
      this.sessionStorage.SetContext(this.basSecurityContext);
    }
  
    public async LogOut(): Promise<void>
    {
      let basSecurityContext: BasSecurityContext = this.sessionStorage.GetContext();
      if (basSecurityContext.GetSessionId() != undefined && basSecurityContext.GetSessionId() != null && basSecurityContext.GetSessionId() != "" && basSecurityContext.GetSessionId() != "null") {
        await this.basAuth.CloseSession(basSecurityContext);
      }
      this.sessionStorage.Clear();
    }
  
    //Method For Restoring the token values to session storage service — — -//
    private SetSessionToken(): void {
      let basSecurityContext: BasSecurityContext = this.sessionStorage.GetContext();
      if (basSecurityContext.GetSessionId() != undefined && basSecurityContext.GetSessionId() != null && basSecurityContext.GetSessionId() != "" && basSecurityContext.GetSessionId() != "null") {
        this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
        this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
      } else {
  
        basSecurityContext = this.getSecurityContext;
        this.sessionStorage.Set(this.sessionStorage.SESSION_ID_TOKEN, this.basSecurityContext.GetSessionId());
        this.sessionStorage.Set(this.sessionStorage.SESSION_AUTHENTICATED, String(this.basSecurityContext.GetIsAuthenticated()));
      }
      this.sessionStorage.SetContext(basSecurityContext)
    }
    //Method for getting access token from session model
    public get getSecurityContext(): BasSecurityContext {
      let accessToken;
      accessToken = this.sessionStorage.GetContext();
      return accessToken;
    }

    public  ClearSessions(): void {
      this.sessionStorage.Clear();
    }
  
    public SessionsIsEmpty(): boolean
    {
      return !this.sessionStorage.TokenExists();
    }

    //Method for checking login state from auth guard
    async LoginState(): Promise<boolean> {
      let _basSecurityContext: BasSecurityContext = this.sessionStorage.GetContext();
      if (_basSecurityContext.GetIsAuthenticated())
      {
        try {
          let result = await this.basAuth.CheckSession(_basSecurityContext);
          return result;
        }
        catch (error:any) {
          this.sessionStorage.Clear();
          return false;
        }
      }
      else
      {
        this.sessionStorage.Clear();
        return false;
      }
    }

     async CheckSession(ctx:BasSecurityContext): Promise<boolean> {
     // let _basSecurityContext: BasSecurityContext = this.sessionStorage.GetContext();
      if (ctx.GetIsAuthenticated())
      {
        try {
          let result = await this.basAuth.CheckSession(ctx);
          return result;
        }
        catch (error:any) {
         // this.sessionStorage.Clear();
         console.log("Erreur dans CheckSession BasAuthHelper=="+JSON.stringify( error))
          return false;
        }
      }
      else
      {
       // this.sessionStorage.Clear();
            console.log("Erreur dans CheckSession BasAuthHelper== itulisateurs non connecté"  )

        return false;
      }
    }
  
  }
  