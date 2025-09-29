import request from 'supertest';
import express from 'express';
import router from '../src/routes/liste_des_reglements.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { SoapServerError, UpstreamTimeoutError } from '../src/common/errors';

jest.mock('../src/services/soap.service', () => ({
  sendSoapRequest: jest.fn().mockImplementation(() => {
    throw new SoapServerError(
      'SOAP.FAULT',
      'Faulted',
      { soapFault: { faultcode: 'Client', faultstring: 'Invalid request' } }
    );
  })
}));

const app = express();
app.use(express.json());
app.use('/t', router);
app.use(notFoundHandler);
app.use(errorHandler);

describe('ProblemDetails responses', () => {
  it('SOAP fault returns application/problem+json with status 502', async () => {
    const res = await request(app).post('/t').send({});
    expect(res.status).toBe(502);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
  expect(res.body.status).toBe(502);
  expect(typeof res.body.title).toBe('string');
  expect(typeof res.body.detail).toBe('string');
  // Error handler returns ProblemDetails; request-id header may be set by top-level app
    expect(res.headers['x-soap-fault']).toBe('1');
  });
});
