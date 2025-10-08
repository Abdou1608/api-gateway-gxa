import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { xtlog_search } from '../services/profile/xtlog_search.service';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';
import { invalidateToken } from '../auth/token-revocation.service';
import { closesession_ } from '../services/logout/closesession_.service';
import { AuthError } from '../common/errors';
import fs from 'fs';
import ajout_piece_au_contrat from './ajout_piece_au_contrat.routes';
import { cont_newpiece } from '../services/ajout_piece_au_contrat/cont_newpiece.service';
import check_session from './check_session.routes';
import create_contrat from './create_contrat.routes';
import create_quittance from './create_quittance.routes';
import create_reglement from './create_reglement.routes';
import create_tier from './create_tier.routes';
import detail_contrat from './detail_contrat.routes';
import detail_adhesion from './detail_adhesion.routes';
import { adh_details } from '../services/detail_adhesion/adh_details.service';
import detail_produit from './detail_produit.routes';
import detail_quittance from './detail_quittance.routes';
import detail_tier from './detail_tier.routes';
import liste_des_contrats from './liste_des_contrats.routes';
import liste_des_contrats_d_un_tier from './liste_des_contrats_d_un_tier.routes';
import liste_des_produits from './liste_des_produits.routes';
import liste_des_quittances from './liste_des_quittances.routes';
import list_des_tecrants from './liste_des_tecrants.routes';
import recherche_tier from './recherche_tier.routes';
import update_contrat from './update_contrat.routes';
import * as Risk from '../services/risk.service';
import { updateTier as updateTierService } from '../services/update_tier.fastify.service';
import { authPreHandler } from '../middleware/auth.fastify';
import { validateBodyFastify } from '../middleware/zod.fastify';
import { api_loginValidator } from '../validators/api_loginValidator';
import { api_logoutValidator } from '../validators/api_logoutValidator';
import AuthService from '../auth/auth.service';
import env from '../config/env';
import { opensession } from '../services/login/opensession';
import { InternalError } from '../common/errors';
import { api_liste_des_contratsValidator } from '../validators/api_liste_des_contratsValidator';
import { cont_search } from '../services/liste_des_contrats/cont_search.service';
import { api_liste_des_produitsValidator } from '../validators/api_liste_des_produitsValidator';
import { produit_listitems } from '../services/liste_des_produits/produit_listitems.service';
import groupByTypename from '../utils/groupByTypename';
import { api_liste_des_quittancesValidator } from '../validators/api_liste_des_quittancesValidator';
import { quittance_listitems } from '../services/liste_des_quittances/quittance_listitems.service';
import { api_detail_contratValidator } from '../validators/api_detail_contratValidator';
import { cont_details } from '../services/detail_contrat/cont_details.service';
import { api_detail_produitValidator } from '../validators/api_detail_produitValidator';
import { produit_details } from '../services/detail_produit/produit_details.service';
import { api_detail_tierValidator } from '../validators/api_detail_tierValidator';
import { tiers_details } from '../services/detail_tier/tiers_details.service';
import { api_liste_des_contrats_d_un_tierValidator } from '../validators/api_liste_des_contrats_d_un_tierValidator';
import { cont_listitems } from '../services/liste_des_contrats_d_un_tier/cont_listitems.service';
import * as ProjectService from '../services/project.service';
import * as Validators from '../validators';
import { api_detail_quittanceValidator } from '../validators/api_detail_quittanceValidator';
import { quittance_details } from '../services/detail_quittance/quittance_details.service';
import { api_liste_des_bransValidator } from '../validators/api_liste_des_bransValidator';
import { bran_listitems } from '../services/Bran_listitems.service';
import { api_tiers_searchValidator } from '../validators/api_tiers_searchValidator';
import { tiers_search } from '../services/liste_des_tiers/tiers_search.service';
import { api_contrat_updateValidator } from '../validators/api_contrat_updateValidator';
import { cont_update, cont_piece_update } from '../services/update_contrat/cont_update.service';
import { api_update_piece_contratValidator } from '../validators/api_update_piece_contratValidator';
import { api_contrats_searchValidator } from '../validators/api_contrats_searchValidator';
import { contrats_search } from '../services/contrats_search.service';
import { catal_listitems } from '../services/catal_listitems.service';

export const registerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // TODO: migrate existing Express routes to Fastify here.
  // Keep a basic ping for now to validate wiring.
  app.get('/ping', async () => ({ pong: true }));
  // Fastify-native /api/login (keeps Express version temporarily for compatibility)
  const authService = new AuthService({ defaultTtlSeconds: 1800 });
  app.post('/api/login', { preValidation: validateBodyFastify(api_loginValidator) }, async (request, reply) => {
    const body = request.body as any;
    const logon: string | undefined = body?.login ?? body?.username;
    const password: string | undefined = body?.password;
    const domain: string | undefined = body?.domain;

    request.log.info({ user: logon, domain }, '[login] incoming auth request');

    if (logon && password && domain) {
      try {
        const result: unknown = await opensession(logon, password, domain);
        const anyResult = result as any | undefined;
        const SID = (anyResult?.SessionId ?? anyResult?._SessionId) as string | undefined;
        if (!SID) {
          request.log.error('[login] Missing SessionID in upstream result');
          throw new InternalError('Missing SessionID from upstream');
        }

        const key = env.jwtSecret ?? '';
        if (!key) {
          request.log.error('[login] Missing JWS_KEY env');
          throw new InternalError('Server misconfiguration: JWS_KEY is missing');
        }

        const token = await authService.get_token(key, SID);
        reply.header('Authorization', `Bearer ${token}`);
        return reply.send({ ...(anyResult || {}), token });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        request.log.error({ err: error }, '[login] Error');
        throw new InternalError(message);
      }
    } else {
      throw new AuthError('Données manquantes ou non conforme');
    }
  });

  // Schema validation for /api/profile
  const profileSchema = z.object({
    domain: z.string().min(1),
    email: z.string().optional().refine(v => v === undefined || v.length > 0, 'email must be non-empty if provided'),
    login: z.string().min(1),
    dossier: z.string().optional().refine(v => v === undefined || v.length > 0, 'dossier must be non-empty if provided'),
    BasSecurityContext: z.object({ _SessionId: z.string().min(1) })
  });

  type ProfileBody = z.infer<typeof profileSchema>;

  app.post('/api/profile', {preHandler:authPreHandler}, async (request, reply) => {
    // Validate body
    const parsed = profileSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', issues: parsed.error.issues });
    }
    const body: ProfileBody = parsed.data;

    // Extract bearer if present
    const authHeader = request.headers['authorization'] || request.headers['Authorization'] as any;
    const bearer = typeof authHeader === 'string' ? (authHeader.match(/^Bearer\s+(.+)$/i)?.[1]) : undefined;

    // Build BasSecurityContext using authoritative SID when available from pre-auth
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    // Prefer sid from any auth pre-handler if present, else from body
    const reqAny = request as any;
    const sid: string | undefined = reqAny.auth?.sid ?? body.BasSecurityContext?._SessionId;
    ctx.SessionId = sid as any;

    const username = body.login;
    const domain = body.domain;

    const result = await xtlog_search(
      ctx,
      username,
      domain,
      { userId: reqAny.user?.sub, domain }
    );

    const empty = result == null || (typeof result === 'object' && Object.keys(result as any).length === 0);
    if (empty) {
      if (bearer) {
        try { await invalidateToken(bearer); } catch {}
      }
      if (ctx.SessionId) {
        try { await closesession_(ctx.SessionId as any); } catch {}
      }
      throw new AuthError('Unauthorized', { reason: 'empty profile' });
    }
    request.log.info({ username, domain }, 'profile fetched');
    return reply.send(result);
  });

  // --- Admin guard (Fastify) ---
  async function adminGuardFastify(request: any, reply: any) {
    const configured = process.env.ADMIN_SECRET;
    if (!configured) return reply.code(503).send({ error: 'Admin secret not configured' });
    const provided = request.headers['x-admin-secret'] as string | undefined;
    const devBypass = process.env.NODE_ENV !== 'production';
    const providedQuery = (request.query?.admin_secret as string | undefined) || undefined;
    const okHeader = provided && provided === configured;
    const okQuery = devBypass && providedQuery && providedQuery === configured;
    if (!okHeader && !okQuery) return reply.code(401).send({ error: 'Unauthorized' });
  }

  // --- Native /api/logout ---
  app.post('/api/logout', { preValidation: validateBodyFastify(api_logoutValidator) }, async (request, reply) => {
    try {
      await closesession_((request.body as any));
      return reply.code(200).send({ ok: true });
    } catch (error) {
      request.log.error({ err: error }, 'logout error');
      return reply.code(500).send({ ok: false });
    }
  });

  // --- Admin API (native) ---
  app.post('/api/admin/revoke', { preHandler: adminGuardFastify }, async (request, reply) => {
    const token = (request.body as any)?.token;
    if (!token || typeof token !== 'string') return reply.code(400).send({ error: 'token required' });
    await invalidateToken(token);
    return reply.code(204).send();
  });

  app.get('/api/admin/revocation-metrics', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const metrics = await (await import('../auth/token-revocation.service')).getRevocationMetrics();
    return reply.send(metrics);
  });

  app.get('/api/admin/pending-queue', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { PendingQueue } = await import('../utils/pending-queue');
    const items = PendingQueue.snapshot();
    return reply.send({ size: items.length, items });
  });

  app.get('/api/admin/pending-queue/snapshot', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { PendingQueue } = await import('../utils/pending-queue');
    const line = PendingQueue.formatSnapshot();
    reply.type('text/plain');
    return reply.send(line || '(empty)');
  });

  app.get('/api/admin/soap-audit', { preHandler: adminGuardFastify }, async (request, reply) => {
    const q = request.query as Record<string, string>;
    const pick = (k: string) => (q?.[k] ?? undefined);
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

    const { SoapAudit } = await import('../observability/soap-audit');
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
    return reply.send({ items });
  });

  app.get('/api/admin/soap-audit/download', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { SoapAudit } = await import('../observability/soap-audit');
    const file = SoapAudit.logPath();
    reply.header('Content-Disposition', 'attachment; filename=soap-audit.log');
    reply.type('text/plain');
    const fs = await import('fs');
    return reply.send(fs.createReadStream(file));
  });

  app.post('/api/admin/soap-audit/reset', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { SoapAudit } = await import('../observability/soap-audit');
    await SoapAudit.clear();
    return reply.code(204).send();
  });

  app.post('/api/admin/soap-audit/index/rebuild', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { SoapAudit } = await import('../observability/soap-audit');
    await SoapAudit.rebuildIndex();
    return reply.code(202).send({ status: 'rebuilding' });
  });
  app.post('/api/admin/soap-audit/index/sync', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const { SoapAudit } = await import('../observability/soap-audit');
    await SoapAudit.ensureIndexUpToDate();
    return reply.code(202).send({ status: 'synced' });
  });

  // --- Admin HTML UIs (native) ---
  app.get('/api/admin/pending-queue/ui', { preHandler: adminGuardFastify }, async (_request, reply) => {
    const html = String.raw`<!doctype html>
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
    const html = String.raw`<!doctype html>
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
  app.post('/api/ajout_piece_au_contrat', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await cont_newpiece(
      body.contrat,
      body.produit,
      body.effet,
      body.data,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/liste_des_contrats
  app.post('/api/liste_des_contrats', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_liste_des_contratsValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;

    const reference = body.reference ?? '';
    const detailorigine = body.detailorigine;
    const origine = body.origine;
    const codefic = body.codefic ?? '';
    const nomchamp = body.nomchamp ?? '';

    const result = await cont_search(
      reference,
      detailorigine,
      origine,
      codefic,
      nomchamp,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/liste_des_produits
  app.post('/api/liste_des_produits', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_liste_des_produitsValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;

    const typeecran = body.typeecran ?? null;
    const branche = body.branche ?? null;
    const disponible = body.disponible ?? true;

    const result = await produit_listitems(
      typeecran,
      branche,
      disponible,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/liste_des_quittances
  app.post('/api/liste_des_quittances', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_liste_des_quittancesValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;

    const dossier = body.dossier ?? body.Dossier ?? null;
    const contrat = body.contrat ?? body.Contrat ?? null;
    const result = await quittance_listitems(
      dossier,
      contrat,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    const grouped = groupByTypename(result, { keepUnknown: true });
    return reply.send(grouped);
  });

  // Fastify-native /api/detail_contrat
  app.post('/api/detail_contrat', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_detail_contratValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await cont_details(
      body,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/projects endpoints
  app.post('/api/projects/project_listitems', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_listitemsValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectListItems(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/Project_OfferListItems', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_offerlistitemsValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectOfferListItems(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_detail', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_detailValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectDetail(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_create', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_createValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectCreate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_update', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_updateValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectUpdate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_addoffer', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_addofferValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectAddOffer(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_deleteoffer', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_deleteofferValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectDeleteOffer(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/projects/project_validateoffer', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(Validators.api_projects_project_validateofferValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const data = await ProjectService.projectValidateOffer(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  // Fastify-native /api/detail_produit
  app.post('/api/detail_produit', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_detail_produitValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const code = body.code;
    const options = body.options ?? true;
    const basecouv =  false;
    const clauses = body.clauses ?? true;
    const result = await produit_details(
      code,
      ctx,
      options,
      basecouv,
      clauses,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/detail_tier
  app.post('/api/detail_tier', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_detail_tierValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const dossier = body.Dossier ?? body.dossier;
    const comp = body.composition ?? true;
    const ext = false;
    const result = await tiers_details(
      ctx,
      dossier,
      comp,
      ext,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/liste_des_contrats_d_un_tier
  app.post('/api/liste_des_contrats_d_un_tier', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_liste_des_contrats_d_un_tierValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const dossier = body.dossier ?? body.Dossier;
    const includeall = body.includeall ?? true;
    const defaut = body.defaut ?? false;
    const result = await cont_listitems(
      dossier,
      includeall,
      defaut,
      ctx,
      { userId: (request as any).user?.sub || undefined, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/detail_quittance
  app.post('/api/detail_quittance', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_detail_quittanceValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await quittance_details(
      body.quittance,
      body.details ?? true,
      body.garanties ?? true,
      body.addinfospqg ?? true,
      body.intervenants ?? true,
      body.addinfosqint ?? true,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/liste_des_types_ecrans
  app.post('/api/liste_des_types_ecrans', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_liste_des_bransValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await bran_listitems(
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });
  app.post('/api/catal_ListItems', {
    preHandler: authPreHandler,
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await catal_listitems(
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });
  // Fastify-native /api/Tiers_Search
  app.post('/api/Tiers_Search', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_tiers_searchValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await tiers_search(
      ctx,
      body.reference ?? '',
      body.dppname ?? null,
      body.ntel ?? null,
      body.datenais ?? null,
      body.typetiers ?? null,
      body.rsociale ?? null,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  app.post('/api/Contrats_Search', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_contrats_searchValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await contrats_search(
      ctx,
      body.reference ?? '',
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/Contrat_Update
  app.post('/api/Contrat_Update', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_contrat_updateValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await cont_update(
      body.contrat,
      body.effet,
      body.piece,
      body.data,
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(result);
  });

  // Fastify-native /api/update_piece_contrat
  app.post('/api/update_piece_contrat', {
    preHandler: authPreHandler,
    preValidation: validateBodyFastify(api_update_piece_contratValidator),
  }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const response = await cont_piece_update(
      body.contrat,
      body.produit ? body.produit : undefined,
      body.piece,
      body.effet ? body.effet : null,
      body.data ? body.data : '',
      ctx,
      { userId: (request as any).user?.sub, domain: body?.domain }
    );
    return reply.send(response);
  });

  // Fastify-native check_session
  app.post('/api/check_session', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { checksession_ } = await import('../services/check_session/checksession_.service');
    const result = await checksession_(ctx);
    return reply.send(result);
  });

  // Fastify-native create_* routes
  app.post('/api/create_contrat', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { cont_create } = await import('../services/create_contrat/cont_create.service');
    const result = await cont_create(body.dossier, body.produit, body.effet, body.data, ctx, { userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(result);
  });

  app.post('/api/create_quittance', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { quittance_create } = await import('../services/create_quittance/quittance_create.service');
    const result = await quittance_create(body.contrat, body.piece, body.bordereau, false, true, body.data, ctx, undefined, undefined, { userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(result);
  });

  app.post('/api/create_quittance/autocalcule', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { quittance_create } = await import('../services/create_quittance/quittance_create.service');
    const result = await quittance_create(body.contrat, body.piece, body.bordereau, true, true, body.data, ctx, body.datedebut, body.datedefin, { userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(result);
  });

  app.post('/api/create_reglement', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { kco_cashtransaction } = await import('../services/create_reglement/kco_cashtransaction.service');
    const result = await kco_cashtransaction(body, ctx, { userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(result);
  });

  app.post('/api/create_tier', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const { tiers_create } = await import('../services/create_tier/tiers_create.service');
    const result = await tiers_create(ctx, body.typtiers, body.nature, body.numtiers ?? null, body.numdpp ?? null, body.data, { userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(result);
  });

  // Fastify-native detail_adhesion
  app.post('/api/detail_adhesion', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const ctx = new BasSecurityContext();
    ctx.IsAuthenticated = true as any;
    ctx.SessionId = (request as any).auth?.sid ?? body?.BasSecurityContext?._SessionId;
    const result = await adh_details(body, ctx, { userId: (request as any).user?.sub, domain: body?.domain } as any);
    return reply.send(result);
  });

  // Fastify-native sinistres endpoints
  app.post('/api/sinistres/sinistre_listitems', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { sinistreListItems } = await import('../services/sinistre.service');
    const data = await sinistreListItems(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/sinistres/sinistre_detail', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { sinistreDetail } = await import('../services/sinistre.service');
    const data = await sinistreDetail(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/sinistres/sinistre_create', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { sinistreCreate } = await import('../services/sinistre.service');
    const data = await sinistreCreate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  app.post('/api/sinistres/sinistre_update', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { sinistreUpdate } = await import('../services/sinistre.service');
    const data = await sinistreUpdate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  // Fastify-native tabs endpoints
  app.post('/api/tabs/Tab_ListItems', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { tabListItems } = await import('../services/Tab.services');
    const data = await tabListItems(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });
  app.post('/api/tabs/Tab_ListValues', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { tabListValues } = await import('../services/Tab.services');
    const data = await tabListValues(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });
  app.post('/api/tabs/Tab_GetValue', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const { tabGetValue } = await import('../services/Tab.services');
    const data = await tabGetValue(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  // Fastify-native risk endpoints
  app.post('/api/risk/risk_listitems', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const data = await Risk.riskListItems(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });
  app.post('/api/risk/risk_create', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const data = await Risk.riskCreate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });
  app.post('/api/risk/risk_update', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const data = await Risk.riskUpdate(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  // Fastify-native Tier update endpoint
  app.put('/api/Tiers_Update', { preHandler: authPreHandler }, async (request, reply) => {
    const body = request.body as any;
    const data = await updateTierService(body, { sid: (request as any).auth.sid, userId: (request as any).user?.sub, domain: body?.domain });
    return reply.send(data);
  });

  // Express bridge fully removed; all business/admin/public routes are native
};
