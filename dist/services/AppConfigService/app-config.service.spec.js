"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const app_config_service_1 = require("./app-config.service");
describe('AppConfigService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(app_config_service_1.AppConfigService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
