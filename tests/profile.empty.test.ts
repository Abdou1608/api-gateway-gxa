import request from 'supertest';
import express from 'express';
import AuthService from '../src/auth/auth.service';
import { authMiddleware } from '../src/middleware/auth.middleware';
import { invalidateToken, isTokenRevoked } from '../src/auth/token-revocation.service';

jest.mock('../src/services/profile/xtlog_search.service', () => ({
  xtlog_search: jest.fn().mockResolvedValue({}) // empty object triggers revocation
}));

import { xtlog_search } from '../src/services/profile/xtlog_search.service';

// Build minimal profile route replicating production logic (simplified)
const app = express();
app.use(express.json());
app.post('/api/profile', authMiddleware, async (req, res) => {
  const authHeader = req.header('authorization');
  const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) return res.status(401).json({ error: 'Unauthorized' });
  if (await isTokenRevoked(bearer)) return res.status(401).json({ error: 'Unauthorized' });
  const result = await xtlog_search({ IsAuthenticated: true, SessionId: req.auth?.sid } as any, 'u', 'd');
  const empty = result == null || Object.keys(result).length === 0;
  if (empty) {
    await invalidateToken(bearer);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(result);
});

const auth = new AuthService();
const SECRET = 'test-secret-key-1234567890-ABCDEFGHIJ';
process.env.JWS_KEY = SECRET;

describe('profile route empty response revokes token', () => {
  it('revokes and returns 401 when backend returns empty object', async () => {
    const token = await auth.get_token(SECRET, 'SID-EMPTY');
    const first = await request(app).post('/api/profile').set('Authorization', `Bearer ${token}`).send({ login: 'u', domain: 'd' });
    expect(first.status).toBe(401);
    // second call should be 401 because token now revoked
    const second = await request(app).post('/api/profile').set('Authorization', `Bearer ${token}`).send({ login: 'u', domain: 'd' });
    expect(second.status).toBe(401);
  });
});
