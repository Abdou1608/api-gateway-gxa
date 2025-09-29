import request from 'supertest';

// Mock the profile service to return an empty object, which should trigger unauthorized logic in the route
jest.mock('../src/services/profile/xtlog_search.service', () => ({
  xtlog_search: jest.fn().mockResolvedValue({}),
}));

import AuthService from '../src/auth/auth.service';

describe('AUTH_ERROR on /profile unauthorized scenario', () => {
  jest.setTimeout(15000);
  it('responds 401 with centralized AUTH_ERROR when profile is empty', async () => {
    // Prepare a valid token so authMiddleware passes
    const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
    process.env.JWS_KEY = SECRET;
    const auth = new AuthService();
    const token = await auth.get_token(SECRET, 'SID-AUTH-ERR');

    // Import app after mocks and env are set, await readiness for routes/plugins
    const { app, ready } = await import('../src/server');
    await ready;

    const res = await request(app.server)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ login: 'nouser', domain: 'test' });

    expect(res.status).toBe(401);
    // Headers are set by the centralized error handler
    expect(res.headers['x-error-type']).toBe('AUTH_ERROR');
    expect(res.headers['x-error-code']).toBe('AUTH.UNAUTHORIZED');
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.status).toBe(401);
    expect(res.body.errorType).toBe('AUTH_ERROR');
    expect(res.body.code).toBe('AUTH.UNAUTHORIZED');
    expect(typeof res.body.detail).toBe('string');
    expect(typeof res.body.requestId).toBe('string');
  });
});
