"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
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
    res.type('html').send(html);
});
exports.default = router;
