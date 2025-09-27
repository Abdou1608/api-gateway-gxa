import request from 'supertest';
import express from 'express';
import router from '../src/routes/liste_des_reglements.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { SoapServerError } from '../src/common/errors';

jest.mock('../src/services/soap.service', () => ({
  sendSoapRequest: jest.fn().mockImplementation(() => {
    throw new SoapServerError(
      'SOAP.FAULT',
      'Faulted',
      { soapFault: { faultcode: 'Client', faultstring: 'Invalid request' } }
    );
  })
}));

// Build a minimal app with the specific router mounted and global error handler
const app = express();
app.use(express.json());
app.use('/t', router);
app.use(notFoundHandler);
app.use(errorHandler);

describe('SOAP_ERROR centralized handling', () => {
  it('returns 502 with headers and error body when SOAP fault occurs', async () => {
    const res = await request(app).post('/t').send({});

    expect(res.status).toBe(502);
    expect(res.headers['x-error-type']).toBe('SOAP_ERROR');
    expect(res.headers['x-soap-fault']).toBe('1');
    expect(res.body.error.type).toBe('SOAP_ERROR');
    expect(res.body.error.code).toBe('SOAP.FAULT');
    expect(res.body.error.details.soapFault.faultcode).toBe('Client');
  });
});
