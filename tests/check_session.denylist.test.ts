import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../src/middleware/auth.middleware';
import { tokenRevocationPrecheck } from '../src/middleware/token-revocation-precheck.middleware';
import AuthService from '../src/auth/auth.service';
import { invalidateToken } from '../src/auth/token-revocation.service';

// Minimal handler to simulate check_session success
const app = express();
app.use(express.json());
app.post('/api/check_session', authMiddleware, tokenRevocationPrecheck, (req, res) => {
  return res.json({ ok: true, sid: req.auth?.sid });
});

const auth = new AuthService();
const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
process.env.JWS_KEY = SECRET;

describe('check_session denylist integration', () => {
  it('returns 401 after token is invalidated manually', async () => {
    const token = await auth.get_token(SECRET, 'SID-CS');
    // initial success
    const okResp = await request(app).post('/api/check_session').set('Authorization', `Bearer ${token}`).send({});
    expect(okResp.status).toBe(200);
    expect(okResp.body.sid).toBe('SID-CS');
    // invalidate
    await invalidateToken(token);
    // subsequent call must be 401
    const denied = await request(app).post('/api/check_session').set('Authorization', `Bearer ${token}`).send({});
    expect(denied.status).toBe(401);
  });
});
