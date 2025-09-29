"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditUiRouter = exports.queueUiRouter = void 0;
const express_1 = require("express");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const pending_queue_1 = require("../utils/pending-queue");
const admin_queue_html_1 = __importDefault(require("./admin.queue.html"));
const admin_soap_audit_html_1 = __importDefault(require("./admin.soap-audit.html"));
const admin_guard_1 = require("../middleware/admin.guard");
const errors_1 = require("../common/errors");
const soap_audit_1 = require("../observability/soap-audit");
const router = (0, express_1.Router)();
router.post('/revoke', admin_guard_1.adminGuard, async (req, res, next) => {
    const token = req.body?.token;
    if (!token || typeof token !== 'string')
        return next(new errors_1.ValidationError('token required', [{ path: 'token', message: 'required' }]));
    await (0, token_revocation_service_1.invalidateToken)(token);
    return res.status(204).send();
});
router.get('/revocation-metrics', admin_guard_1.adminGuard, async (_req, res, _next) => {
    const metrics = await (0, token_revocation_service_1.getRevocationMetrics)();
    res.json(metrics);
});
// Expose in-flight SOAP queue for dashboards
router.get('/pending-queue', admin_guard_1.adminGuard, async (_req, res, _next) => {
    const items = pending_queue_1.PendingQueue.snapshot();
    res.json({ size: items.length, items });
});
// CLI-friendly single-line snapshot
router.get('/pending-queue/snapshot', admin_guard_1.adminGuard, async (_req, res, _next) => {
    const line = pending_queue_1.PendingQueue.formatSnapshot();
    res.type('text/plain').send(line || '(empty)');
});
// SOAP Audit endpoints
router.get('/soap-audit', admin_guard_1.adminGuard, async (req, res) => {
    // Query params for server-side filtering/sorting to handle large datasets
    const q = req.query;
    const pick = (k) => (Array.isArray(q[k]) ? q[k][0] : q[k]);
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
        const { items, nextCursor } = await soap_audit_1.SoapAudit.queryFile({
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
    let items = soap_audit_1.SoapAudit.snapshot(limit);
    items = items.filter((it) => {
        if (actionQ && !(it.action || '').toLowerCase().includes(actionQ))
            return false;
        if (ownerQ && !(it.owner || '').toLowerCase().includes(ownerQ))
            return false;
        if (outcome && it.outcome !== (outcome === 'success' ? 'success' : 'error'))
            return false;
        if (since && (it.start || 0) < since)
            return false;
        if (until && (it.start || 0) > until)
            return false;
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
router.get('/soap-audit/download', admin_guard_1.adminGuard, async (_req, res) => {
    res.download(soap_audit_1.SoapAudit.logPath(), 'soap-audit.log');
});
router.post('/soap-audit/reset', admin_guard_1.adminGuard, async (_req, res) => {
    await soap_audit_1.SoapAudit.clear();
    res.status(204).send();
});
// Index admin helpers
router.post('/soap-audit/index/rebuild', admin_guard_1.adminGuard, async (_req, res) => {
    await soap_audit_1.SoapAudit.rebuildIndex();
    res.status(202).json({ status: 'rebuilding' });
});
router.post('/soap-audit/index/sync', admin_guard_1.adminGuard, async (_req, res) => {
    await soap_audit_1.SoapAudit.ensureIndexUpToDate();
    res.status(202).json({ status: 'synced' });
});
exports.default = router;
// Re-export a helper to mount sub-routers if needed
exports.queueUiRouter = admin_queue_html_1.default;
exports.auditUiRouter = admin_soap_audit_html_1.default;
