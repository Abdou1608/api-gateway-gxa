"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const zod_1 = require("zod");
const xtlog_search_service_1 = require("../services/profile/xtlog_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const closesession__service_1 = require("../services/logout/closesession_.service");
const errors_1 = require("../common/errors");
const cont_newpiece_service_1 = require("../services/ajout_piece_au_contrat/cont_newpiece.service");
const adh_details_service_1 = require("../services/detail_adhesion/adh_details.service");
const Risk = __importStar(require("../services/risk.service"));
const update_tier_fastify_service_1 = require("../services/update_tier.fastify.service");
const auth_fastify_1 = require("../middleware/auth.fastify");
const zod_fastify_1 = require("../middleware/zod.fastify");
const api_loginValidator_1 = require("../validators/api_loginValidator");
const api_logoutValidator_1 = require("../validators/api_logoutValidator");
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const env_1 = __importDefault(require("../config/env"));
const opensession_1 = require("../services/login/opensession");
const errors_2 = require("../common/errors");
const api_liste_des_contratsValidator_1 = require("../validators/api_liste_des_contratsValidator");
const cont_search_service_1 = require("../services/liste_des_contrats/cont_search.service");
const api_liste_des_produitsValidator_1 = require("../validators/api_liste_des_produitsValidator");
const produit_listitems_service_1 = require("../services/liste_des_produits/produit_listitems.service");
const groupByTypename_1 = __importDefault(require("../utils/groupByTypename"));
const api_liste_des_quittancesValidator_1 = require("../validators/api_liste_des_quittancesValidator");
const quittance_listitems_service_1 = require("../services/liste_des_quittances/quittance_listitems.service");
const api_detail_contratValidator_1 = require("../validators/api_detail_contratValidator");
const cont_details_service_1 = require("../services/detail_contrat/cont_details.service");
const api_detail_produitValidator_1 = require("../validators/api_detail_produitValidator");
const produit_details_service_1 = require("../services/detail_produit/produit_details.service");
const api_detail_tierValidator_1 = require("../validators/api_detail_tierValidator");
const tiers_details_service_1 = require("../services/detail_tier/tiers_details.service");
const api_liste_des_contrats_d_un_tierValidator_1 = require("../validators/api_liste_des_contrats_d_un_tierValidator");
const cont_listitems_service_1 = require("../services/liste_des_contrats_d_un_tier/cont_listitems.service");
const ProjectService = __importStar(require("../services/project.service"));
const Validators = __importStar(require("../validators"));
const api_detail_quittanceValidator_1 = require("../validators/api_detail_quittanceValidator");
const quittance_details_service_1 = require("../services/detail_quittance/quittance_details.service");
const api_liste_des_bransValidator_1 = require("../validators/api_liste_des_bransValidator");
const Bran_listitems_service_1 = require("../services/Bran_listitems.service");
const api_tiers_searchValidator_1 = require("../validators/api_tiers_searchValidator");
const tiers_search_service_1 = require("../services/liste_des_tiers/tiers_search.service");
const api_contrat_updateValidator_1 = require("../validators/api_contrat_updateValidator");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const api_update_piece_contratValidator_1 = require("../validators/api_update_piece_contratValidator");
const api_contrats_searchValidator_1 = require("../validators/api_contrats_searchValidator");
const contrats_search_service_1 = require("../services/contrats_search.service");
const catal_listitems_service_1 = require("../services/catal_listitems.service");
const tools_convert_routes_1 = __importDefault(require("./tools.convert.routes"));
const Qbor_Listitems_service_1 = require("../services/Qbor_Listitems.service");
const Cont_CalculTarif_service_1 = require("../services/create_contrat/Cont_CalculTarif.service");
const registerRoutes = async (app) => {
    // TODO: migrate existing Express routes to Fastify here.
    // Keep a basic ping for now to validate wiring.
    app.get('/ping', async () => ({ pong: true }));
    // Fastify-native /api/login (keeps Express version temporarily for compatibility)
    const authService = new auth_service_1.default({ defaultTtlSeconds: 1800 });
    app.post('/api/login', { preValidation: (0, zod_fastify_1.validateBodyFastify)(api_loginValidator_1.api_loginValidator) }, async (request, reply) => {
        const body = request.body;
        const logon = body?.login ?? body?.username;
        const password = body?.password;
        const domain = body?.domain;
        request.log.info({ user: logon, domain }, '[login] incoming auth request');
        if (logon && password && domain) {
            try {
                const result = await (0, opensession_1.opensession)(logon, password, domain);
                const anyResult = result;
                const SID = (anyResult?.SessionId ?? anyResult?._SessionId);
                if (!SID) {
                    request.log.error('[login] Missing SessionID in upstream result');
                    throw new errors_2.InternalError('Missing SessionID from upstream');
                }
                const key = env_1.default.jwtSecret ?? '';
                if (!key) {
                    request.log.error('[login] Missing JWS_KEY env');
                    throw new errors_2.InternalError('Server misconfiguration: JWS_KEY is missing');
                }
                const token = await authService.get_token(key, SID);
                reply.header('Authorization', `Bearer ${token}`);
                return reply.send({ ...(anyResult || {}), token });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                request.log.error({ err: error }, '[login] Error');
                throw new errors_2.InternalError(message);
            }
        }
        else {
            throw new errors_1.AuthError('Données manquantes ou non conforme');
        }
    });
    // Schema validation for /api/profile
    const profileSchema = zod_1.z.object({
        domain: zod_1.z.string().min(1),
        email: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, 'email must be non-empty if provided'),
        login: zod_1.z.string().min(1),
        dossier: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, 'dossier must be non-empty if provided'),
        BasSecurityContext: zod_1.z.object({ _SessionId: zod_1.z.string().min(1) })
    });
    app.post('/api/profile', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        // Validate body
        const parsed = profileSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Invalid body', issues: parsed.error.issues });
        }
        const body = parsed.data;
        // Extract bearer if present
        const authHeader = request.headers['authorization'] || request.headers['Authorization'];
        const bearer = typeof authHeader === 'string' ? (authHeader.match(/^Bearer\s+(.+)$/i)?.[1]) : undefined;
        // Build BasSecurityContext using authoritative SID when available from pre-auth
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        // Prefer sid from any auth pre-handler if present, else from body
        const reqAny = request;
        const sid = reqAny.auth?.sid ?? body.BasSecurityContext?._SessionId;
        ctx.SessionId = sid;
        const username = body.login;
        const domain = body.domain;
        const result = await (0, xtlog_search_service_1.xtlog_search)(ctx, username, domain, { userId: reqAny.user?.sub, domain });
        const empty = result == null || (typeof result === 'object' && Object.keys(result).length === 0);
        if (empty) {
            if (bearer) {
                try {
                    await (0, token_revocation_service_1.invalidateToken)(bearer);
                }
                catch { }
            }
            if (ctx.SessionId) {
                try {
                    await (0, closesession__service_1.closesession_)(ctx.SessionId);
                }
                catch { }
            }
            throw new errors_1.AuthError('Unauthorized', { reason: 'empty profile' });
        }
        request.log.info({ username, domain }, 'profile fetched');
        return reply.send(result);
    });
    // --- Admin guard (Fastify) ---
    async function adminGuardFastify(request, reply) {
        const configured = process.env.ADMIN_SECRET;
        if (!configured)
            return reply.code(503).send({ error: 'Admin secret not configured' });
        const provided = request.headers['x-admin-secret'];
        const devBypass = process.env.NODE_ENV !== 'production';
        const providedQuery = request.query?.admin_secret || undefined;
        const okHeader = provided && provided === configured;
        const okQuery = devBypass && providedQuery && providedQuery === configured;
        if (!okHeader && !okQuery)
            return reply.code(401).send({ error: 'Unauthorized' });
    }
    // --- Native /api/logout ---
    app.post('/api/logout', { preValidation: (0, zod_fastify_1.validateBodyFastify)(api_logoutValidator_1.api_logoutValidator) }, async (request, reply) => {
        try {
            await (0, closesession__service_1.closesession_)(request.body);
            return reply.code(200).send({ ok: true });
        }
        catch (error) {
            request.log.error({ err: error }, 'logout error');
            return reply.code(500).send({ ok: false });
        }
    });
    // --- Admin API (native) ---
    app.post('/api/admin/revoke', { preHandler: adminGuardFastify }, async (request, reply) => {
        const token = request.body?.token;
        if (!token || typeof token !== 'string')
            return reply.code(400).send({ error: 'token required' });
        await (0, token_revocation_service_1.invalidateToken)(token);
        return reply.code(204).send();
    });
    app.get('/api/admin/revocation-metrics', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const metrics = await (await Promise.resolve().then(() => __importStar(require('../auth/token-revocation.service')))).getRevocationMetrics();
        return reply.send(metrics);
    });
    app.get('/api/admin/pending-queue', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { PendingQueue } = await Promise.resolve().then(() => __importStar(require('../utils/pending-queue')));
        const items = PendingQueue.snapshot();
        return reply.send({ size: items.length, items });
    });
    app.get('/api/admin/pending-queue/snapshot', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { PendingQueue } = await Promise.resolve().then(() => __importStar(require('../utils/pending-queue')));
        const line = PendingQueue.formatSnapshot();
        reply.type('text/plain');
        return reply.send(line || '(empty)');
    });
    app.get('/api/admin/soap-audit', { preHandler: adminGuardFastify }, async (request, reply) => {
        const q = request.query;
        const pick = (k) => (q?.[k] ?? undefined);
        const limit = Math.max(1, Math.min(2000, parseInt(pick('limit') || '500', 10) || 500));
        const actionQ = (pick('action') || '').toLowerCase().trim();
        const ownerQ = (pick('owner') || '').toLowerCase().trim();
        const outcome = (pick('outcome') || '').toLowerCase().trim();
        const sinceStr = pick('since');
        const untilStr = pick('until');
        const sortBy = (pick('sortBy') || 'start').toLowerCase();
        const order = (pick('order') || 'desc').toLowerCase();
        const cursorStart = pick('cursorStart');
        const cursorId = pick('cursorId');
        const useIndex = (pick('useIndex') || 'true').toLowerCase() === 'true';
        const since = sinceStr ? Date.parse(sinceStr) : undefined;
        const until = untilStr ? Date.parse(untilStr) : undefined;
        const { SoapAudit } = await Promise.resolve().then(() => __importStar(require('../observability/soap-audit')));
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
            return reply.send({ items, nextCursor });
        }
        let items = SoapAudit.snapshot(limit);
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
        return reply.send({ items });
    });
    app.get('/api/admin/soap-audit/download', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { SoapAudit } = await Promise.resolve().then(() => __importStar(require('../observability/soap-audit')));
        const file = SoapAudit.logPath();
        reply.header('Content-Disposition', 'attachment; filename=soap-audit.log');
        reply.type('text/plain');
        const fs = await Promise.resolve().then(() => __importStar(require('fs')));
        return reply.send(fs.createReadStream(file));
    });
    app.post('/api/admin/soap-audit/reset', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { SoapAudit } = await Promise.resolve().then(() => __importStar(require('../observability/soap-audit')));
        await SoapAudit.clear();
        return reply.code(204).send();
    });
    app.post('/api/admin/soap-audit/index/rebuild', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { SoapAudit } = await Promise.resolve().then(() => __importStar(require('../observability/soap-audit')));
        await SoapAudit.rebuildIndex();
        return reply.code(202).send({ status: 'rebuilding' });
    });
    app.post('/api/admin/soap-audit/index/sync', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const { SoapAudit } = await Promise.resolve().then(() => __importStar(require('../observability/soap-audit')));
        await SoapAudit.ensureIndexUpToDate();
        return reply.code(202).send({ status: 'synced' });
    });
    // --- Admin HTML UIs (native) ---
    app.get('/api/admin/pending-queue/ui', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const html = String.raw `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Pending Queue</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; margin: 16px; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; font-size: 13px; }
    th { background: #f6f6f6; text-align: left; }
    .meta { color: #666; font-size: 12px; margin-bottom: 8px; }
  </style>
  <script>
    function buildUrl(pathname){
      const url = new URL(pathname, window.location.origin);
      const adminSecret = new URLSearchParams(window.location.search).get('admin_secret');
      if (adminSecret) url.searchParams.set('admin_secret', adminSecret);
      return url.toString();
    }
    async function refresh() {
      try {
        const res = await fetch(buildUrl('/api/admin/pending-queue'));
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        const tbody = document.querySelector('#queue-body');
        tbody.innerHTML = '';
        const now = Date.now();
        for (const item of data.items) {
          const tr = document.createElement('tr');
          const age = Math.max(0, now - item.startedAt);
          const sec = (age / 1000).toFixed(2);
          tr.innerHTML = [
            '<td>'+item.id+'</td>',
            '<td>'+item.action+'</td>',
            '<td>'+(item.owner || '')+'</td>',
            '<td>'+(item.domain || '')+'</td>',
            '<td>'+new Date(item.startedAt).toLocaleTimeString()+'</td>',
            '<td>'+sec+'s</td>'
          ].join('');
          tbody.appendChild(tr);
        }
        document.querySelector('#meta').textContent = 'Size: '+data.size+' • Updated: '+new Date().toLocaleTimeString();
      } catch (e) {
        console.error(e);
      }
    }
    let timer;
    function start() { if (!timer) { timer = setInterval(refresh, 2500); } }
    function stop() { if (timer) { clearInterval(timer); timer = undefined; } }
    function clearRows() { const tb = document.querySelector('#queue-body'); tb.innerHTML=''; document.querySelector('#meta').textContent = 'Size: 0 • Cleared '+new Date().toLocaleTimeString(); }
    window.addEventListener('DOMContentLoaded', () => { refresh(); start(); });
  </script>
</head>
<body>
  <h1>Pending SOAP Queue</h1>
  <div class="meta" id="meta">Loading…</div>
  <div style="margin:8px 0;">
    <button onclick="stop()">Pause</button>
    <button onclick="start()">Resume</button>
    <button onclick="clearRows()">Clear</button>
  </div>
  <table>
    <thead><tr>
      <th>#</th>
      <th>Action</th>
      <th>Owner</th>
      <th>Domain</th>
      <th>Started</th>
      <th>Age</th>
    </tr></thead>
    <tbody id="queue-body"></tbody>
  </table>
</body>
</html>`;
        reply.type('text/html');
        return reply.send(html);
    });
    app.get('/api/admin/soap-audit/ui', { preHandler: adminGuardFastify }, async (_request, reply) => {
        const html = String.raw `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>SOAP Audit</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; margin: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; font-size: 12px; }
    th { background: #f6f6f6; text-align: left; }
    .meta { color: #666; font-size: 12px; margin: 8px 0; }
    .toolbar { margin: 8px 0; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .ok { color: #1b5e20; }
    .err { color: #b71c1c; }
    .filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 8px 0; }
    .filters label { font-size: 12px; color: #444; margin-right: 4px; }
    .filters input { padding: 4px 6px; font-size: 12px; }
    .chips { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .chip { border: 1px solid #bbb; border-radius: 16px; padding: 2px 8px; cursor: pointer; font-size: 12px; user-select: none; }
    .chip.active { border-color: #333; background: #eee; }
    .sort { display: flex; gap: 6px; align-items: center; }
    .drawer { margin-top: 12px; border: 1px solid #ddd; padding: 8px; background: #fafafa; display: none; }
    .drawer.open { display: block; }
    pre { background: #fff; border: 1px solid #eee; padding: 8px; overflow: auto; }
  </style>
  <script>
    let DATA = { items: [] };
    function buildUrl(pathname){
      const url = new URL(pathname, window.location.origin);
      const adminSecret = new URLSearchParams(window.location.search).get('admin_secret');
      if (adminSecret) url.searchParams.set('admin_secret', adminSecret);
      return url;
    }
    let FILTERS = { action: '', owner: '', since: '', until: '' };
    let OUTCOME = '';// '', 'success', 'error'
    let SORT = { by: 'start', order: 'desc' }; // by: 'start' | 'duration'
    let SERVER = false;
    let SELECTED = null;

    function applyFilters() {
      const tbody = document.querySelector('#audit-body');
      tbody.innerHTML = '';
      let items = DATA.items || [];
      // outcome quick-filter
      if (OUTCOME) items = items.filter(it => it.outcome === OUTCOME);
      const action = (FILTERS.action||'').toLowerCase().trim();
      const owner = (FILTERS.owner||'').toLowerCase().trim();
      const since = FILTERS.since ? new Date(FILTERS.since).getTime() : undefined;
      const until = FILTERS.until ? new Date(FILTERS.until).getTime() : undefined;
      const now = Date.now();
      // local sort
      items = items.slice().sort((a,b)=>{
        const dir = SORT.order === 'asc' ? 1 : -1;
        if (SORT.by === 'duration'){
          const ad = a.durationMs ?? ((a.end ?? a.start) - a.start);
          const bd = b.durationMs ?? ((b.end ?? b.start) - b.start);
          return (ad - bd) * dir;
        }
        return ((a.start||0) - (b.start||0)) * dir;
      });
      let shown = 0;
      for (const item of items) {
        if (action && !(item.action||'').toLowerCase().includes(action)) continue;
        if (owner && !(item.owner||'').toLowerCase().includes(owner)) continue;
        const t = item.start || 0;
        if (since && t < since) continue;
        if (until && t > until) continue;
        const tr = document.createElement('tr');
        tr.tabIndex = 0;
        tr.setAttribute('role','row');
        tr.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            tr.classList.add('active');
            setTimeout(()=>tr.classList.remove('active'), 150);
            showDetails(item);
          }
        });
        tr.addEventListener('click', () => showDetails(item));
        const dur = item.durationMs ?? (item.end ? (item.end - item.start) : (now - item.start));
        const durSec = (dur/1000).toFixed(2);
        const ts = new Date(item.start).toLocaleTimeString();
        const outcome = item.outcome === 'success' ? '<span class="ok">success</span>' : '<span class="err">error</span>';
        tr.innerHTML = [
          '<td>'+ (item.id ?? '-') +'</td>',
          '<td>'+ (item.action || '-') +'</td>',
          '<td>'+ (item.owner || '-') +'</td>',
          '<td>'+ (item.domain || '-') +'</td>',
          '<td>'+ ts +'</td>',
          '<td>'+ durSec +'s</td>',
          '<td>'+ outcome +'</td>',
          '<td>'+ (item.httpStatus ?? '-') +'</td>',
          '<td>'+ (item.errorCode || '-') +'</td>',
          '<td>'+ (item.errorMessage || '-') +'</td>'
        ].join('');
        tbody.appendChild(tr);
        shown++;
      }
      const meta = document.querySelector('#meta');
      meta.textContent = 'Shown: '+shown+' of '+(items.length||0)+' • Updated: '+new Date().toLocaleTimeString();
    }
    async function refresh() {
      try {
  const url = buildUrl('/api/admin/soap-audit');
        if (SERVER) {
          if (FILTERS.action) url.searchParams.set('action', FILTERS.action);
          if (FILTERS.owner) url.searchParams.set('owner', FILTERS.owner);
          if (FILTERS.since) url.searchParams.set('since', new Date(FILTERS.since).toISOString());
          if (FILTERS.until) url.searchParams.set('until', new Date(FILTERS.until).toISOString());
          if (OUTCOME) url.searchParams.set('outcome', OUTCOME);
          url.searchParams.set('sortBy', SORT.by);
          url.searchParams.set('order', SORT.order);
          url.searchParams.set('limit', '1000');
        }
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        DATA = data || { items: [] };
        NEXT_CURSOR = data.nextCursor || null;
        applyFilters();
        updatePager();
      } catch (e) { console.error(e); }
    }
    let timer; function start(){ if(!timer){ timer=setInterval(refresh,2500);} }
    function stop(){ if(timer){ clearInterval(timer); timer=undefined; } }
  async function clearAudit(){ try{ await fetch(buildUrl('/api/admin/soap-audit/reset'),{ method:'POST' }); refresh(); } catch(e){ console.error(e);} }
    function clearRows(){ document.querySelector('#audit-body').innerHTML=''; document.querySelector('#meta').textContent='Cleared '+new Date().toLocaleTimeString(); }
  function dl(){ const u = buildUrl('/api/admin/soap-audit/download'); window.location.href = u.toString(); }
    function onFilterChange(id){
      const el = document.getElementById(id);
      if(!el) return;
      FILTERS[id] = el.value;
      applyFilters();
    }
    function setOutcome(o){ OUTCOME = (OUTCOME===o? '': o); updateChips(); if (SERVER) refresh(); else applyFilters(); }
    function updateChips(){
      for (const o of ['success','error']){
        const el = document.getElementById('chip-'+o);
        if (el) el.classList.toggle('active', OUTCOME===o);
      }
    }
    function setSort(by){ SORT.by = by; if (SERVER) refresh(); else applyFilters(); updateSortControls(); }
    function toggleOrder(){ SORT.order = SORT.order==='asc'?'desc':'asc'; if (SERVER) refresh(); else applyFilters(); updateSortControls(); }
    function updateSortControls(){
      const bySel = document.getElementById('sort-by'); if (bySel) bySel.value = SORT.by;
      const oBtn = document.getElementById('sort-order'); if (oBtn) oBtn.textContent = SORT.order==='asc'?'Asc':'Desc';
    }
  let NEXT_CURSOR = null;
  const CURSOR_STACK = [];
    function toggleServer(el){ SERVER = el.checked; refresh(); }
    function showDetails(item){
      SELECTED = item;
      const drawer = document.getElementById('drawer');
      const pre = document.getElementById('drawer-pre');
      const meta = document.getElementById('drawer-meta');
      if (!drawer || !pre || !meta) return;
      const lines = [
        'ID: '+(item.id??'-'),
        'Action: '+(item.action||'-'),
        'Owner: '+(item.owner||'-'),
        'Domain: '+(item.domain||'-'),
        'Outcome: '+item.outcome,
        'Start: '+new Date(item.start).toISOString(),
        'End: '+(item.end? new Date(item.end).toISOString() : '-'),
        'Duration(ms): '+(item.durationMs ?? ((item.end ?? item.start) - item.start)),
        'HTTP: '+(item.httpStatus ?? '-'),
        'ErrorCode: '+(item.errorCode || '-'),
        'ErrorMessage: '+(item.errorMessage || '-')
      ];
      meta.textContent = lines.join('\n');
      // If payload snippets are attached in future, display them; placeholder now
      const snippet = item.payloadSnippet || item.errorSnippet || '';
      pre.textContent = snippet || '// No payload snippet available';
      drawer.classList.add('open');
    }
    function closeDetails(){ const d=document.getElementById('drawer'); if(d) d.classList.remove('open'); SELECTED=null; }
    async function nextPage(){
      if (!SERVER) return; if (!NEXT_CURSOR) return; 
      try {
        // push current next cursor to history for 'previous' navigation
        CURSOR_STACK.push(NEXT_CURSOR);
  const url = buildUrl('/api/admin/soap-audit');
        if (FILTERS.action) url.searchParams.set('action', FILTERS.action);
        if (FILTERS.owner) url.searchParams.set('owner', FILTERS.owner);
        if (FILTERS.since) url.searchParams.set('since', new Date(FILTERS.since).toISOString());
        if (FILTERS.until) url.searchParams.set('until', new Date(FILTERS.until).toISOString());
        if (OUTCOME) url.searchParams.set('outcome', OUTCOME);
        url.searchParams.set('sortBy', SORT.by);
        url.searchParams.set('order', SORT.order);
        url.searchParams.set('limit', '1000');
        url.searchParams.set('cursorStart', NEXT_CURSOR.start);
        url.searchParams.set('cursorId', NEXT_CURSOR.id);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        // Append to DATA and render
        const newItems = Array.isArray(data.items) ? data.items : [];
        DATA.items = (DATA.items || []).concat(newItems);
        NEXT_CURSOR = data.nextCursor || null;
        applyFilters();
        updatePager();
      } catch(e){ console.error(e); }
    }
    async function prevPage(){
      if (!SERVER) return; if (!CURSOR_STACK.length) return;
      try {
        // Remove last pushed cursor to go back one page context
        const prev = CURSOR_STACK.pop();
        if (!prev) return;
  const url = buildUrl('/api/admin/soap-audit');
        if (FILTERS.action) url.searchParams.set('action', FILTERS.action);
        if (FILTERS.owner) url.searchParams.set('owner', FILTERS.owner);
        if (FILTERS.since) url.searchParams.set('since', new Date(FILTERS.since).toISOString());
        if (FILTERS.until) url.searchParams.set('until', new Date(FILTERS.until).toISOString());
        if (OUTCOME) url.searchParams.set('outcome', OUTCOME);
        url.searchParams.set('sortBy', SORT.by);
        url.searchParams.set('order', SORT.order);
        url.searchParams.set('limit', '1000');
        // In desc ordering, backing up means we need to re-query from the previous cursor's start/id and rebuild the list up to that window.
        url.searchParams.set('cursorStart', prev.start);
        url.searchParams.set('cursorId', prev.id);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        // Rebuild list up to this page window: take initial base (first page) plus each stack-applied page; here we simplify by replacing with new items.
        DATA.items = Array.isArray(data.items) ? data.items : [];
        NEXT_CURSOR = data.nextCursor || null;
        applyFilters();
        updatePager();
      } catch(e){ console.error(e); }
    }
    function updatePager(){
      const btn = document.getElementById('next-page');
      if (btn) btn.disabled = !SERVER || !NEXT_CURSOR;
      const prevBtn = document.getElementById('prev-page');
      if (prevBtn) prevBtn.disabled = !SERVER || CURSOR_STACK.length === 0;
    }
    window.addEventListener('DOMContentLoaded', ()=>{ refresh(); start(); });
  </script>
</head>
<body>
  <h1>SOAP Audit</h1>
  <div class="toolbar">
    <button onclick="stop()">Pause</button>
    <button onclick="start()">Resume</button>
    <button onclick="clearRows()">Clear View</button>
    <button onclick="clearAudit()">Reset Audit Log</button>
    <button onclick="dl()">Download Log</button>
  </div>
  <div class="filters" aria-label="Filters">
    <label for="action">Action</label>
    <input id="action" name="action" type="text" placeholder="e.g. RunAction" oninput="onFilterChange('action')" />
    <label for="owner">Owner</label>
    <input id="owner" name="owner" type="text" placeholder="user/session id" oninput="onFilterChange('owner')" />
    <label for="since">Since</label>
    <input id="since" name="since" type="datetime-local" onchange="onFilterChange('since')" />
    <label for="until">Until</label>
    <input id="until" name="until" type="datetime-local" onchange="onFilterChange('until')" />
    <span class="chips">
      <span class="chip" id="chip-success" onclick="setOutcome('success')">Success</span>
      <span class="chip" id="chip-error" onclick="setOutcome('error')">Error</span>
    </span>
    <span class="sort">
      <label for="sort-by">Sort</label>
      <select id="sort-by" onchange="setSort(this.value)">
        <option value="start">Time</option>
        <option value="duration">Duration</option>
      </select>
      <button id="sort-order" onclick="toggleOrder()">Desc</button>
    </span>
    <label><input type="checkbox" onchange="toggleServer(this)"> Server-side filter</label>
    <button id="prev-page" onclick="prevPage()" disabled>Previous page</button>
    <button id="next-page" onclick="nextPage()" disabled>Next page</button>
  </div>
  <div class="meta" id="meta">Loading…</div>
  <table>
    <thead><tr>
      <th>#</th>
      <th>Action</th>
      <th>Owner</th>
      <th>Domain</th>
      <th>Start</th>
      <th>Duration</th>
      <th>Outcome</th>
      <th>HTTP</th>
      <th>Error Code</th>
      <th>Error Message</th>
    </tr></thead>
    <tbody id="audit-body"></tbody>
  </table>
  <div id="drawer" class="drawer" role="region" aria-label="Details drawer">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <strong>Selected Entry</strong>
      <button onclick="closeDetails()">Close</button>
    </div>
    <pre id="drawer-meta"></pre>
    <pre id="drawer-pre"></pre>
  </div>
</body>
</html>`;
        reply.type('text/html');
        return reply.send(html);
    });
    if (process.env.NODE_ENV !== 'production') {
        app.get('/debug/pending-queue/ui', async (_req, reply) => reply.redirect('/api/admin/pending-queue/ui'));
        app.get('/debug/soap-audit/ui', async (_req, reply) => reply.redirect('/api/admin/soap-audit/ui'));
    }
    // Fastify-native /api/ajout_piece_au_contrat
    app.post('/api/ajout_piece_au_contrat', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, cont_newpiece_service_1.cont_newpiece)(body.contrat, body.produit, body.effet, body.data, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/liste_des_contrats
    app.post('/api/liste_des_contrats', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_liste_des_contratsValidator_1.api_liste_des_contratsValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const reference = body.reference ?? '';
        const detailorigine = body.detailorigine;
        const origine = body.origine;
        const codefic = body.codefic ?? '';
        const nomchamp = body.nomchamp ?? '';
        const result = await (0, cont_search_service_1.cont_search)(reference, detailorigine, origine, codefic, nomchamp, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/liste_des_produits
    app.post('/api/liste_des_produits', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_liste_des_produitsValidator_1.api_liste_des_produitsValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const typeecran = body.typeecran ?? null;
        const branche = body.branche ?? null;
        const disponible = body.disponible ?? true;
        const result = await (0, produit_listitems_service_1.produit_listitems)(typeecran, branche, disponible, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/liste_des_quittances
    app.post('/api/liste_des_quittances', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_liste_des_quittancesValidator_1.api_liste_des_quittancesValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const dossier = body.dossier ?? body.Dossier ?? null;
        const contrat = body.contrat ?? body.Contrat ?? null;
        const result = await (0, quittance_listitems_service_1.quittance_listitems)(dossier, contrat, ctx, { userId: request.user?.sub, domain: body?.domain });
        const grouped = (0, groupByTypename_1.default)(result, { keepUnknown: true });
        return reply.send(grouped);
    });
    // Fastify-native /api/detail_contrat
    app.post('/api/detail_contrat', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_detail_contratValidator_1.api_detail_contratValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, cont_details_service_1.cont_details)(body, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/projects endpoints
    app.post('/api/projects/project_listitems', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_listitemsValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectListItems(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/Project_OfferListItems', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_offerlistitemsValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectOfferListItems(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_detail', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_detailValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectDetail(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_create', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_createValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectCreate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_update', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_updateValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectUpdate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_addoffer', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_addofferValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectAddOffer(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_deleteoffer', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_deleteofferValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectDeleteOffer(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/projects/project_validateoffer', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(Validators.api_projects_project_validateofferValidator),
    }, async (request, reply) => {
        const body = request.body;
        const data = await ProjectService.projectValidateOffer(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    // Fastify-native /api/detail_produit
    app.post('/api/detail_produit', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_detail_produitValidator_1.api_detail_produitValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const code = body.code;
        const options = body.options ?? true;
        const basecouv = false;
        const clauses = body.clauses ?? true;
        const result = await (0, produit_details_service_1.produit_details)(code, ctx, options, basecouv, clauses, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/detail_tier
    app.post('/api/detail_tier', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_detail_tierValidator_1.api_detail_tierValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const dossier = body.Dossier ?? body.dossier;
        const comp = body.composition ?? true;
        const ext = false;
        const result = await (0, tiers_details_service_1.tiers_details)(ctx, dossier, comp, ext, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/liste_des_contrats_d_un_tier
    app.post('/api/liste_des_contrats_d_un_tier', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_liste_des_contrats_d_un_tierValidator_1.api_liste_des_contrats_d_un_tierValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const dossier = body.dossier ?? body.Dossier;
        const includeall = body.includeall ?? true;
        const defaut = body.defaut ?? false;
        const result = await (0, cont_listitems_service_1.cont_listitems)(dossier, includeall, defaut, ctx, { userId: request.user?.sub || undefined, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/detail_quittance
    app.post('/api/detail_quittance', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_detail_quittanceValidator_1.api_detail_quittanceValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, quittance_details_service_1.quittance_details)(body.quittance, body.details ?? true, body.garanties ?? true, body.addinfospqg ?? true, body.intervenants ?? true, body.addinfosqint ?? true, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/liste_des_types_ecrans
    app.post('/api/Qbor_Listitems', {
        preHandler: auth_fastify_1.authPreHandler,
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, Qbor_Listitems_service_1.Qbor_Listitems)(ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/liste_des_types_ecrans', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_liste_des_bransValidator_1.api_liste_des_bransValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, Bran_listitems_service_1.bran_listitems)(ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/catal_ListItems', {
        preHandler: auth_fastify_1.authPreHandler,
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, catal_listitems_service_1.catal_listitems)(ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/Tiers_Search
    app.post('/api/Tiers_Search', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_tiers_searchValidator_1.api_tiers_searchValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, tiers_search_service_1.tiers_search)(ctx, body.reference ?? '', body.dppname ?? null, body.ntel ?? null, body.datenais ?? null, body.typetiers ?? null, body.rsociale ?? null, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/Contrats_Search', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_contrats_searchValidator_1.api_contrats_searchValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, contrats_search_service_1.contrats_search)(ctx, body.reference ?? '', { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/Contrat_Update
    app.post('/api/Contrat_Update', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_contrat_updateValidator_1.api_contrat_updateValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, cont_update_service_1.cont_update)(body.contrat, body.effet, body.piece, body.data, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native /api/update_piece_contrat
    app.post('/api/update_piece_contrat', {
        preHandler: auth_fastify_1.authPreHandler,
        preValidation: (0, zod_fastify_1.validateBodyFastify)(api_update_piece_contratValidator_1.api_update_piece_contratValidator),
    }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const response = await (0, cont_update_service_1.cont_piece_update)(body.contrat, body.produit ? body.produit : undefined, body.piece, body.effet ? body.effet : null, body.data ? body.data : '', ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(response);
    });
    // Fastify-native check_session
    app.post('/api/check_session', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { checksession_ } = await Promise.resolve().then(() => __importStar(require('../services/check_session/checksession_.service')));
        const result = await checksession_(ctx);
        return reply.send(result);
    });
    // Fastify-native create_* routes
    app.post('/api/create_contrat', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { cont_create } = await Promise.resolve().then(() => __importStar(require('../services/create_contrat/cont_create.service')));
        const result = await cont_create(body.dossier, body.produit, body.effet ?? body.Effet, body.data, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/Cont_CalculTarif', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { Cont_CalculTarif } = await Promise.resolve().then(() => __importStar(require('../services/create_contrat/Cont_CalculTarif.service')));
        const details = body.details ?? true;
        const result = await Cont_CalculTarif(body.contrat, body.piece ?? 1, body.adhesion ?? null, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/create_quittance', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { quittance_create } = await Promise.resolve().then(() => __importStar(require('../services/create_quittance/quittance_create.service')));
        const result = await quittance_create(body.contrat, body.piece, body.Bordereau, body.autocalcul ?? true, body.affectation ?? true, body.data, ctx, body.datedebut, body.datedefin, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/create_quittance/autocalcule', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { quittance_create } = await Promise.resolve().then(() => __importStar(require('../services/create_quittance/quittance_create.service')));
        const result = await quittance_create(body.contrat, body.piece, body.bordereau, true, true, body.data, ctx, body.datedebut, body.datedefin, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/create_reglement', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { kco_cashtransaction } = await Promise.resolve().then(() => __importStar(require('../services/create_reglement/kco_cashtransaction.service')));
        const result = await kco_cashtransaction(body, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    app.post('/api/create_tier', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const { tiers_create } = await Promise.resolve().then(() => __importStar(require('../services/create_tier/tiers_create.service')));
        const result = await tiers_create(ctx, body.typtiers, body.nature, body.numtiers ?? null, body.numdpp ?? null, body.data, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native detail_adhesion
    app.post('/api/detail_adhesion', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const ctx = new BasSecurityContext_1.BasSecurityContext();
        ctx.IsAuthenticated = true;
        ctx.SessionId = request.auth?.sid ?? body?.BasSecurityContext?._SessionId;
        const result = await (0, adh_details_service_1.adh_details)(body, ctx, { userId: request.user?.sub, domain: body?.domain });
        return reply.send(result);
    });
    // Fastify-native sinistres endpoints
    app.post('/api/sinistres/sinistre_listitems', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { sinistreListItems } = await Promise.resolve().then(() => __importStar(require('../services/sinistre.service')));
        const data = await sinistreListItems(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/sinistres/sinistre_detail', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { sinistreDetail } = await Promise.resolve().then(() => __importStar(require('../services/sinistre.service')));
        const data = await sinistreDetail(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/sinistres/sinistre_create', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { sinistreCreate } = await Promise.resolve().then(() => __importStar(require('../services/sinistre.service')));
        const data = await sinistreCreate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/sinistres/sinistre_update', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { sinistreUpdate } = await Promise.resolve().then(() => __importStar(require('../services/sinistre.service')));
        const data = await sinistreUpdate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    // Fastify-native tabs endpoints
    app.post('/api/tabs/Tab_ListItems', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { tabListItems } = await Promise.resolve().then(() => __importStar(require('../services/Tab.services')));
        const data = await tabListItems(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/tabs/Tab_ListValues', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { tabListValues } = await Promise.resolve().then(() => __importStar(require('../services/Tab.services')));
        const data = await tabListValues(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/tabs/Tab_GetValue', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const { tabGetValue } = await Promise.resolve().then(() => __importStar(require('../services/Tab.services')));
        const data = await tabGetValue(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    // Fastify-native risk endpoints
    app.post('/api/risk/risk_listitems', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const data = await Risk.riskListItems(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/risk/risk_create', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const data = await Risk.riskCreate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    app.post('/api/risk/risk_update', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const data = await Risk.riskUpdate(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        const calc_data = await (0, Cont_CalculTarif_service_1.Cont_CalculTarif)(data.contrat, data.piece ?? 1, data.adhesion ?? null, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain }).catch(() => null);
        if (calc_data) {
            return reply.send({ data, calc_data });
        }
        else {
            return reply.send({ data });
        }
    });
    // Fastify-native Tier update endpoint
    app.put('/api/Tiers_Update', { preHandler: auth_fastify_1.authPreHandler }, async (request, reply) => {
        const body = request.body;
        const data = await (0, update_tier_fastify_service_1.updateTier)(body, { sid: request.auth.sid, userId: request.user?.sub, domain: body?.domain });
        return reply.send(data);
    });
    // Express bridge fully removed; all business/admin/public routes are native
    await app.register(tools_convert_routes_1.default);
};
exports.registerRoutes = registerRoutes;
