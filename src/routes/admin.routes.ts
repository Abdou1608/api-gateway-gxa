import { Router } from 'express';
import { invalidateToken, getRevocationMetrics } from '../auth/token-revocation.service';
import { PendingQueue } from '../utils/pending-queue';
import queueUi from './admin.queue.html';
import auditUi from './admin.soap-audit.html';
import { adminGuard } from '../middleware/admin.guard';
import { ValidationError } from '../common/errors';
import { SoapAudit } from '../observability/soap-audit';

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

// Expose in-flight SOAP queue for dashboards
router.get('/pending-queue', adminGuard, async (_req, res, _next) => {
  const items = PendingQueue.snapshot();
  res.json({ size: items.length, items });
});

// CLI-friendly single-line snapshot
router.get('/pending-queue/snapshot', adminGuard, async (_req, res, _next) => {
  const line = PendingQueue.formatSnapshot();
  res.type('text/plain').send(line || '(empty)');
});

// SOAP Audit endpoints
router.get('/soap-audit', adminGuard, async (req, res) => {
  // Query params for server-side filtering/sorting to handle large datasets
  const q = req.query as Record<string, string | string[]>;
  const pick = (k: string) => (Array.isArray(q[k]) ? (q[k] as string[])[0] : (q[k] as string|undefined));
  const limit = Math.max(1, Math.min(2000, parseInt(pick('limit') || '500', 10) || 500));
  const actionQ = (pick('action') || '').toLowerCase().trim();
  const ownerQ = (pick('owner') || '').toLowerCase().trim();
  const outcome = (pick('outcome') || '').toLowerCase().trim(); // '', 'success', 'error'
  const sinceStr = pick('since');
  const untilStr = pick('until');
  const sortBy = (pick('sortBy') || 'start').toLowerCase(); // 'start' | 'duration'
  const order = (pick('order') || 'desc').toLowerCase(); // 'asc' | 'desc'
  const cursorStart = pick('cursorStart');
  const cursorId = pick('cursorId');
  const useIndex = (pick('useIndex') || 'true').toLowerCase() === 'true';

  const since = sinceStr ? Date.parse(sinceStr) : undefined;
  const until = untilStr ? Date.parse(untilStr) : undefined;

  // Prefer file-backed streaming when useIndex=true or cursor provided (to support pagination reliably)
  if (useIndex || (cursorStart && cursorId)) {
    const { items, nextCursor } = await SoapAudit.queryFile({
      limit,
      action: actionQ,
      owner: ownerQ,
      outcome: outcome === 'success' ? 'success' : outcome === 'error' ? 'error' : '',
      since,
      until,
      sortBy: sortBy === 'duration' ? 'duration' : 'start',
      order: order === 'asc' ? 'asc' : 'desc',
      cursor: cursorStart && cursorId ? { start: parseInt(cursorStart, 10), id: parseInt(cursorId, 10) } : null,
      useIndex: true,
    });
    return res.json({ items, nextCursor });
  }

  // Fallback to in-memory snapshot when not using index/cursor
  let items = SoapAudit.snapshot(limit);
  items = items.filter((it) => {
    if (actionQ && !(it.action || '').toLowerCase().includes(actionQ)) return false;
    if (ownerQ && !(it.owner || '').toLowerCase().includes(ownerQ)) return false;
    if (outcome && it.outcome !== (outcome === 'success' ? 'success' : 'error')) return false;
    if (since && (it.start || 0) < since) return false;
    if (until && (it.start || 0) > until) return false;
    return true;
  });
  const dir = order === 'asc' ? 1 : -1;
  items.sort((a, b) => {
    if (sortBy === 'duration') {
      const ad = a.durationMs ?? ((a.end ?? a.start) - a.start);
      const bd = b.durationMs ?? ((b.end ?? b.start) - b.start);
      return (ad - bd) * dir;
    }
    return ((a.start || 0) - (b.start || 0)) * dir;
  });
  res.json({ items });
});

router.get('/soap-audit/download', adminGuard, async (_req, res) => {
  res.download(SoapAudit.logPath(), 'soap-audit.log');
});

router.post('/soap-audit/reset', adminGuard, async (_req, res) => {
  await SoapAudit.clear();
  res.status(204).send();
});

// Index admin helpers
router.post('/soap-audit/index/rebuild', adminGuard, async (_req, res) => {
  await SoapAudit.rebuildIndex();
  res.status(202).json({ status: 'rebuilding' });
});
router.post('/soap-audit/index/sync', adminGuard, async (_req, res) => {
  await SoapAudit.ensureIndexUpToDate();
  res.status(202).json({ status: 'synced' });
});

export default router;

// Re-export a helper to mount sub-routers if needed
export const queueUiRouter = queueUi;
export const auditUiRouter = auditUi;
