import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { errorHandler, notFoundHandler } from '../src/middleware/error-handler';
import { asyncHandler } from '../src/middleware/async-handler';
import { withUserQueue } from '../src/lib/user-queue';

// Build a tiny test router that schedules tasks through withUserQueue
const r = Router();
function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
let concurrent = 0;
let maxObserved = 0;
r.post('/', asyncHandler(async (req, res) => {
  const user = (req as any).user?.sub || 'u1';
  const domain = (req.body && req.body.domain) || 'd1';
  const result = await withUserQueue(user, domain, async () => {
    concurrent++;
    maxObserved = Math.max(maxObserved, concurrent);
    await delay(200);
    concurrent--;
    return { ok: true };
  });
  res.json(result);
}));

const app = express();
app.use(express.json());
app.use('/q', r);
app.use(notFoundHandler);
app.use(errorHandler);

describe('Per-user queue concurrency', () => {
  it('limits to 2 concurrent tasks per user/domain', async () => {
    const reqs = [1,2,3].map(() => request(app).post('/q').send({ domain: 'd1' }));
    const responses = await Promise.all(reqs);
    expect(responses.every(r => r.status === 200)).toBe(true);
    expect(maxObserved).toBeLessThanOrEqual(2);
  });
});
