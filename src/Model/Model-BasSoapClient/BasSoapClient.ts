import axios, { AxiosResponse } from 'axios';
import { BasSoapFault } from '../BasSoapObject/BasSoapFault';
import { handleSoapResponse } from '../../utils/soap-fault-handler';
import logger from '../../utils/logger';
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

      // Centralisation: on laisse handleSoapResponse détecter et lever une AppError au besoin
  const safeXml = handleSoapResponse(response.data, logger);
      return safeXml;
    } catch (error: any) {
      // Si la requête a déjà retourné un XML de fault dans error.response.data, on laisse BasSoapFault pour compat rétro
      const payload = (error?.response?.data ?? error?.response) || error?.message || JSON.stringify(error);
      if (BasSoapFault.IsBasError(payload)) {
        // handleSoapResponse lèvera AppError normalisée
        handleSoapResponse(payload, logger);
      }
      throw error; // Pas une fault SOAP -> propager l'erreur axios originale
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

      if (response.status === 200 && response.data) {
        handleSoapResponse(response.data, logger);
      }
    } catch (error: any) {
      const payload = error?.response?.data || error.message;
      if (BasSoapFault.IsBasError(payload)) handleSoapResponse(payload, logger);
      throw error;
    }
  }
}
