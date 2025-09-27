import request from 'supertest';
import express from 'express';
import router from '../src/routes/liste_des_reglements.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { NetworkError } from '../src/common/errors';
import AuthService from '../src/auth/auth.service';

jest.mock('../src/services/soap.service', () => ({
  sendSoapRequest: jest.fn().mockImplementation(() => {
    throw new NetworkError('Network error', { target: 'upstream-soap' });
  })
}));

const app = express();
app.use(express.json());
app.use('/t', router);
app.use(notFoundHandler);
app.use(errorHandler);

describe('NETWORK_ERROR centralized handling', () => {
  it('returns 502 with centralized schema and headers', async () => {
    const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
    process.env.JWS_KEY = SECRET;
    const auth = new AuthService();
    const token = await auth.get_token(SECRET, 'SID-NET');

    const res = await request(app)
      .post('/t')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(502);
    expect(res.headers['x-error-type']).toBe('NETWORK_ERROR');
    expect(res.body.error.type).toBe('NETWORK_ERROR');
    expect(res.body.error.code).toBe('NETWORK.ERROR');
  });
});
