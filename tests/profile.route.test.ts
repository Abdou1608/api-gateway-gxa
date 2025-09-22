import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../src/middleware/auth.middleware';
import AuthService from '../src/auth/auth.service';

// Build a minimal profile handler mimic (since actual handler depends on soap services). For test we just assert middleware injection.
const app = express();
app.use(express.json());

app.post('/api/profile', authMiddleware, (req, res) => {
  // Expect BasSecurityContext populated automatically even if client didn't send it
  const bsc = (req.body as any).BasSecurityContext;
  return res.json({ sid: req.auth?.sid, injected: !!(bsc && bsc._SessionId) });
});

const auth = new AuthService();
const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
process.env.JWS_KEY = SECRET;

describe('profile route compatibility (Option B)', () => {
  it('401 without bearer', async () => {
    const r = await request(app).post('/api/profile').send({ login: 'u', domain: 'd' });
    expect(r.status).toBe(401);
  });
  it('200 with bearer and auto-injected BasSecurityContext', async () => {
    const token = await auth.get_token(SECRET, 'SID-ABC');
    const r = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ login: 'user', domain: 'dom' });
    expect(r.status).toBe(200);
    expect(r.body.sid).toBe('SID-ABC');
    expect(r.body.injected).toBe(true);
  });
});
