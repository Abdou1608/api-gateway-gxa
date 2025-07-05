"use strict";
//import  HttpClient  from 'express';
//import { Injectable } from '@angular/core';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
class AppConfigService {
    GetURlB4WService() {
        throw new Error("Method not implemented.");
    }
    set baseUrl(value) {
        this._baseUrl = value;
    }
    get baseUrl() {
        return this._baseUrl;
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
        this._baseUrl = "http://ec2-51-44-11-105.eu-west-3.compute.amazonaws.com";
        this._apiEndpoint = "/soap/";
        this._port = 8080;
        this.actionService = "IBasActionService";
        this.webAuthService = "IBasWebAuthService ";
        this.authService = "IBasAuthService";
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
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.authService}`;
    }
    GetURlActionService() {
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.actionService}`;
    }
    GetBasWebAuthService() {
        return `${this.baseUrl}:${this.port}${this.apiEndpoint}${this.webAuthService}`;
    }
}
exports.AppConfigService = AppConfigService;
