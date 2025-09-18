import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../src/middleware/auth.middleware';
import AuthService from '../src/auth/auth.service';

const app = express();
app.use(express.json());

app.post('/api/override-check', authMiddleware, (req, res) => {
  const declared = (req.body as any).BasSecurityContext?._SessionId;
  return res.json({ sid: req.auth?.sid, declared });
});

const auth = new AuthService();
const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
process.env.JWS_KEY = SECRET;

describe('SID precedence over client supplied BasSecurityContext', () => {
  it('overrides a forged BasSecurityContext._SessionId', async () => {
    const token = await auth.get_token(SECRET, 'SID-SERVER-AUTH');
    const r = await request(app)
      .post('/api/override-check')
      .set('Authorization', `Bearer ${token}`)
      .send({ BasSecurityContext: { _SessionId: 'FAKE-CLIENT-SID' } });
    expect(r.status).toBe(200);
    expect(r.body.sid).toBe('SID-SERVER-AUTH');
    expect(r.body.declared).toBe('SID-SERVER-AUTH');
  });
});
