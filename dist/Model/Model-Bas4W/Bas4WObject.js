"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bas4WObject = void 0;
class Image4W {
    constructor() {
        this.type = 1;
        this.Image = "";
        this.name = "";
    }
    ToHTML() {
        if (this.type === 1)
            return "data:image/png;base64, " + this.Image;
        else
            return this.Image;
    }
}
class Bas4WObject {
    constructor() {
        this.top = "";
        this.rigth = "";
        this.bottom = "";
        this.left = "";
        this.logoImage60 = new Image4W();
        this.loginImage = new Image4W();
        this.logoImageIco = new Image4W();
        this.logoImage90 = new Image4W();
    }
    ParseJSon(jsonString) {
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
        }
        ;
    }
    loadDefault(appConfService) {
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
exports.Bas4WObject = Bas4WObject;
