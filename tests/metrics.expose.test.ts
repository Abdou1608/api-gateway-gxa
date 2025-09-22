import request from 'supertest';
import express from 'express';
import { metricsInstrumentation, metricsHandler } from '../src/observability/metrics';

const app = express();
app.use(metricsInstrumentation);
app.get('/metrics', metricsHandler);
app.get('/hello', (_req,res) => res.json({ ok: true }));

describe('metrics endpoint', () => {
  it('exposes http_requests_total and token_revoked_memory_current', async () => {
    await request(app).get('/hello');
    const r = await request(app).get('/metrics');
    expect(r.status).toBe(200);
    expect(r.text).toMatch(/http_requests_total/);
    expect(r.text).toMatch(/token_revoked_memory_current/);
  });
});
