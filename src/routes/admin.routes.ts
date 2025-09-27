import { Router } from 'express';
import { invalidateToken, getRevocationMetrics } from '../auth/token-revocation.service';
import { adminGuard } from '../middleware/admin.guard';
import { ValidationError } from '../common/errors';

const router = Router();

router.post('/revoke', adminGuard, async (req, res, next) => {
  const token = req.body?.token;
  if (!token || typeof token !== 'string') return next(new ValidationError('token required', [ { path: 'token', message: 'required' } ]));
  await invalidateToken(token);
  return res.status(204).send();
});

router.get('/revocation-metrics', adminGuard, async (_req, res, _next) => {
  const metrics = await getRevocationMetrics();
  res.json(metrics);
});

export default router;
