"use strict";
//import  HttpClient  from 'express';
//import { Injectable } from '@angular/core';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
class AppConfigService {
    GetURlB4WService() {
        throw new Error("Method not implemented.");
    }
    //process.env.SOAP_PORT ?? this.port;
    // public set baseUrl(value: string) {
    //   this._baseSOAPUrl = value;
    // }
    get baseUrl() {
        return this._baseSOAPUrl;
    }
    set apiEndpoint(value) {
        this._apiEndpoint = value;
    }
    get apiEndpoint() {
        return this._apiEndpoint;
    }
    set port(value) {
        this._port = value;
    }
    get port() {
        return this._port;
    }
    constructor() {
        this._baseSOAPUrl = process.env.SOAP_BASE_URL || "http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com";
        //process.env.SOAP_URL ??
        //http://10.0.46.11
        //"http://ec2-13-39-84-162.eu-west-3.compute.amazonaws.com"
        this._baseSOAPPort = process.env.SOAP_PORT ?? this.port;
        this._apiEndpoint = process.env.SOAP_API_PATH || "/soap/";
        this._port = 8080;
        this.actionService = process.env.SOAP_ACTION_SERVICE || "IBasActionService";
        this.webAuthService = process.env.SOAP_WEBAUTH_SERVICE || "IBasWebAuthService ";
        this.authService = process.env.SOAP_AUTH_SERVICE || "IBasAuthService";
        this.b4WService = "IBas4WebService";
    }
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
    GetURlAuthService() {
        if (process.env.SOAP_AUTH_URL)
            return process.env.SOAP_AUTH_URL;
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.authService}`;
    }
    GetURlActionService() {
        if (process.env.SOAP_ACTION_URL)
            return process.env.SOAP_ACTION_URL;
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.actionService}`;
    }
    GetBasWebAuthService() {
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.webAuthService}`;
    }
}
exports.AppConfigService = AppConfigService;
