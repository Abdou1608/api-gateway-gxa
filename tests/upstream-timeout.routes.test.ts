import request from 'supertest';
import express from 'express';
import router from '../src/routes/liste_des_reglements.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { UpstreamTimeoutError } from '../src/common/errors';
import AuthService from '../src/auth/auth.service';

jest.mock('../src/services/soap.service', () => ({
  sendSoapRequest: jest.fn().mockImplementation(() => {
    throw new UpstreamTimeoutError('Upstream timeout', { target: 'upstream-soap' });
  })
}));

// Minimal app mounting the route
const app = express();
app.use(express.json());
app.use('/t', router);
app.use(notFoundHandler);
app.use(errorHandler);

describe('UPSTREAM_TIMEOUT centralized handling', () => {
  it('returns 504 with centralized error schema and headers', async () => {
    const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
    process.env.JWS_KEY = SECRET;
    const auth = new AuthService();
    const token = await auth.get_token(SECRET, 'SID-TIMEOUT');

    const res = await request(app)
      .post('/t')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(504);
    expect(res.headers['x-error-type']).toBe('UPSTREAM_TIMEOUT');
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.status).toBe(504);
    expect(res.body.errorType).toBe('UPSTREAM_TIMEOUT');
    expect(res.body.code).toBe('UPSTREAM.TIMEOUT');
    expect(typeof res.body.detail).toBe('string');
  });
});
