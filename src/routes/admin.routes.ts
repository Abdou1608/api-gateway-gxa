import { Router } from 'express';
import { invalidateToken, getRevocationMetrics } from '../auth/token-revocation.service';

const router = Router();

// Simple header-based guard (can be replaced by stronger admin auth later)
function guard(req: any, res: any, next: any) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return res.status(503).json({ error: 'Admin secret not configured' });
  if (req.header('x-admin-secret') !== expected) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.post('/revoke', guard, async (req, res) => {
  const token = req.body?.token;
  if (!token || typeof token !== 'string') return res.status(400).json({ error: 'token required' });
  await invalidateToken(token);
  return res.status(204).send();
});

router.get('/revocation-metrics', guard, async (_req, res) => {
  const metrics = await getRevocationMetrics();
  res.json(metrics);
});

export default router;
