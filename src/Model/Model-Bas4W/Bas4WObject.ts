import { AppConfigService } from "../../services/AppConfigService/app-config.service";


class Image4W {
    public type: number = 1;
    public Image: string = "";
    public name: string = "";

    public ToHTML(): string {
        if (this.type === 1)
            return "data:image/png;base64, " + this.Image
        else
          return this.Image
    }}


export class Bas4WObject {

    public top: string = "";
    public rigth: string = "";
    public bottom: string = "";
    public left: string = "";
    public logoImage60!: Image4W;
    public logoImageIco!: Image4W;
    public logoImage90!: Image4W;
    public loginImage!: Image4W;

    constructor() {
        this.logoImage60 = new Image4W();
        this.loginImage = new Image4W();
        this.logoImageIco = new Image4W();
        this.logoImage90 = new Image4W();
    }


    public ParseJSon(jsonString: string): void {
        if (jsonString !== "") {
            let jsonObject = JSON.parse(jsonString);
            this.top = jsonObject.generics.loginTopText;
            this.rigth = jsonObject.generics.loginRigthText;
            this.bottom = jsonObject.generics.loginBottomText;
            this.left = jsonObject.generics.loginLeftText;

            this.logoImage60.name = jsonObject.generics.logoImage60.name;
            this.logoImage60.type = 1;
            this.logoImage60.Image = jsonObject.generics.logoImage60.base64;

            this.logoImageIco.name = jsonObject.generics.logoImageIco.name;
            this.logoImageIco.type = 1;
            this.logoImageIco.Image = jsonObject.generics.logoImageIco.base64;

            this.logoImage90.name = jsonObject.generics.logoImage90.name;
            this.logoImage90.type = 1;
            this.logoImage90.Image = jsonObject.generics.logoImage90.base64;


            this.loginImage.name = jsonObject.generics.loginImage.name;
            this.loginImage.type = 1;
            this.loginImage.Image = jsonObject.generics.loginImage.base64;
        };        
    }
    public loadDefault(appConfService: AppConfigService)
    {
        if (appConfService.isMaintenance)
            this.top = appConfService.msgMaintenance;
        else
            this.top = appConfService.msgUnavailable;
        this.logoImage60.name = "default logo";
        this.logoImage60.type = 2;
        this.logoImage60.Image = appConfService.defaultLogo;
        this.loginImage.name = "default Image";
        this.loginImage.type = 2;
        this.loginImage.Image = appConfService.defaultImg;
    }
}