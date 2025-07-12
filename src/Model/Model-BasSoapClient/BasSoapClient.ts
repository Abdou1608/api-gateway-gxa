import axios, { AxiosResponse } from 'axios';
import { BasSoapFault } from '../BasSoapObject/BasSoapFault';
import * as fs from 'fs/promises';
import * as path from 'path';

export class BasSoapClient {
  private SoapHeader = '';
  private SoapFooter = '';

  constructor() {
    this.SoapHeader = '';
    this.SoapFooter = '';
  }

  async getFileContent(file: string): Promise<string> {
    const filePath = path.resolve(file);
    return await fs.readFile(filePath, 'utf-8');
  }

  private headerAndFooterNotLoaded(): boolean {
    return this.SoapFooter === '' || this.SoapHeader === '';
  }

  private async loadHeaderAndFooter(): Promise<void> {
    this.SoapHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
    this.SoapHeader += `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"`;
    this.SoapHeader += ` xmlns:ns1="http://belair-info.com/bas/services"`;
    this.SoapHeader += ` xmlns:xsd="http://www.w3.org/2001/XMLSchema"`;
    this.SoapHeader += ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`;
    this.SoapHeader += ` xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"`;
    this.SoapHeader += ` SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">`;
    this.SoapHeader += `<SOAP-ENV:Body>`;
    this.SoapFooter = `</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
  }

  async soapRequest(url: string, request: string): Promise<string> {
    if (this.headerAndFooterNotLoaded()) {
      await this.loadHeaderAndFooter();
    }

    const soapEnvelope = this.SoapHeader + request + this.SoapFooter;

    try {
      const response: AxiosResponse<string> = await axios.post(url, soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
        },
        responseType: 'text',
      });

      if (response.status !== 200) {
        throw response.data || 'Erreur SOAP';
      }
// console.log("From BasSoapClient response in soapRequest.....="+response)
// console.log("From BasSoapClient response in soapRequest+response.data.....="+response.data)
      return response.data;
     
    } catch (error: any) {
      throw error?.response?.data || error.message || 'Erreur lors de l’appel SOAP';
    }
  }

  async soapVoidRequest(url: string, request: string): Promise<void> {
    if (this.headerAndFooterNotLoaded()) {
      await this.loadHeaderAndFooter();
    }

    const soapEnvelope = this.SoapHeader + request + this.SoapFooter;

    try {
      const response: AxiosResponse<string> = await axios.post(url, soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
        },
        responseType: 'text',
      });

      if (response.status === 200 && response.data && BasSoapFault.IsBasError(response.data)) {
        BasSoapFault.ThrowError(response.data);
      }
    } catch (error: any) {
      throw error?.response?.data || error.message;
    }
  }
}
