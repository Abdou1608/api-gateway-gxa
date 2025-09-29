//import  HttpClient  from 'express';
//import { Injectable } from '@angular/core';

export class AppConfigService {
  isMaintenance: any;
  msgMaintenance!: string;
  msgUnavailable!: string;
  defaultLogo!: string;
  defaultImg!: string;
  GetURlB4WService(): string {
      throw new Error("Method not implemented.");
  }

  private _baseSOAPUrl: string = process.env.SOAP_BASE_URL || "http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com";
  //process.env.SOAP_URL ??
  //http://10.0.46.11
  //"http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com"
  
  private _baseSOAPPort: any = process.env.SOAP_PORT ?? this.port
  //process.env.SOAP_PORT ?? this.port;

 // public set baseUrl(value: string) {
 //   this._baseSOAPUrl = value;
 // }
  public get baseUrl(): string {
    return this._baseSOAPUrl;
  }

  private _apiEndpoint: string = process.env.SOAP_API_PATH || "/soap/";
  public set apiEndpoint(value: string) {
    this._apiEndpoint = value;
  }
  public get apiEndpoint(): string {
    return this._apiEndpoint;
  }
  private _port: number = 8080;

  public set port(value: number) {
    this._port = value;
  }
  public get port(): number {
    return this._port;
  }

  private actionService: string = process.env.SOAP_ACTION_SERVICE || "IBasActionService";
  private webAuthService: string = process.env.SOAP_WEBAUTH_SERVICE || "IBasWebAuthService ";
  private authService: string = process.env.SOAP_AUTH_SERVICE || "IBasAuthService";
  private b4WService: string = "IBas4WebService";

  constructor() { }
  /*
  public load(): Promise<any> {
    let path: string = 'assets/app.config.json';
    return this.http.get(path)
      .toPromise()
      .then((data: any) => {
        Object.assign(this, data);
        return data;
      });
  }
*/
  
  public GetURlAuthService(): string {
    if (process.env.SOAP_AUTH_URL) return process.env.SOAP_AUTH_URL;
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.authService}`;
  }


  public GetURlActionService(): string {
    if (process.env.SOAP_ACTION_URL) return process.env.SOAP_ACTION_URL;
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.actionService}`;
  }

  public GetBasWebAuthService(): string {
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.webAuthService}`;
  }

}
