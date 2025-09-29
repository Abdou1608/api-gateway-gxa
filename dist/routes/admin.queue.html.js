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
    res.type('html').send(html);
});
exports.default = router;
