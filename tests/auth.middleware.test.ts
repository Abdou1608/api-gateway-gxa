import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../src/middleware/auth.middleware';
import AuthService from '../src/auth/auth.service';

const app = express();
app.use(express.json());

// Dummy protected route
app.get('/protected', authMiddleware, (req, res) => {
  return res.json({ ok: true, sid: req.auth?.sid });
});

const auth = new AuthService();
const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
process.env.JWS_KEY = SECRET;

describe('authMiddleware', () => {
  it('rejects when no token', async () => {
    const r = await request(app).get('/protected');
    expect(r.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    const r = await request(app).get('/protected').set('Authorization', 'Bearer invalid.token.here');
    expect(r.status).toBe(401);
  });

  it('accepts valid token', async () => {
    const token = await auth.get_token(SECRET, 'SID-123');
    const r = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.sid).toBe('SID-123');
  });
});
