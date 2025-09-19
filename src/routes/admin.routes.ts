import { Router } from 'express';
import { invalidateToken, getRevocationMetrics } from '../auth/token-revocation.service';
import { adminGuard } from '../middleware/admin.guard';

const router = Router();

router.post('/revoke', adminGuard, async (req, res) => {
  const token = req.body?.token;
  if (!token || typeof token !== 'string') return res.status(400).json({ error: 'token required' });
  await invalidateToken(token);
  return res.status(204).send();
});

router.get('/revocation-metrics', adminGuard, async (_req, res) => {
  const metrics = await getRevocationMetrics();
  res.json(metrics);
});

export default router;
