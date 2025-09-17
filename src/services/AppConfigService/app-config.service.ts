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

  private _baseSOAPUrl: string = "http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com";
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

  private _apiEndpoint: string = "/soap/";
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

  private actionService: string = "IBasActionService";
  private webAuthService: string = "IBasWebAuthService ";
  private authService: string = "IBasAuthService";
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
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.authService}`;
  }


  public GetURlActionService(): string {
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.actionService}`;
  }

  public GetBasWebAuthService(): string {
    return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.webAuthService}`;
  }

}
