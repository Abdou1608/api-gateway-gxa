import request from 'supertest';
import express from 'express';
import router from '../src/routes/liste_des_reglements.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { TransformError } from '../src/common/errors';
import AuthService from '../src/auth/auth.service';

jest.mock('../src/services/soap.service', () => ({
  sendSoapRequest: jest.fn().mockImplementation(() => {
    throw new TransformError('Transform error during parsing', { step: 'parse-xml' });
  })
}));

const app = express();
app.use(express.json());
app.use('/t', router);
app.use(notFoundHandler);
app.use(errorHandler);

describe('TRANSFORM_ERROR centralized handling', () => {
  it('returns 500 with centralized schema and headers', async () => {
    const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
    process.env.JWS_KEY = SECRET;
    const auth = new AuthService();
    const token = await auth.get_token(SECRET, 'SID-TRANSFORM');

    const res = await request(app)
      .post('/t')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(500);
    expect(res.headers['x-error-type']).toBe('TRANSFORM_ERROR');
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.status).toBe(500);
    expect(res.body.errorType).toBe('TRANSFORM_ERROR');
    expect(res.body.code).toBe('TRANSFORM.FAILED');
  });
});
