const API_BASE = "https://070193_PROD.worf.replit.dev";

const el = (id) => document.getElementById(id);
const out = el('out');
const statusEl = el('status');
const q = el('q');

function setStatus(msg) {
  const ts = new Date().toLocaleTimeString();
  statusEl.textContent = `${msg} — ${ts}`;
}

async function http(method, url, body) {
  const opt = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opt.body = JSON.stringify(body);
  const res = await fetch(url, opt);
  const txt = await res.text();
  let bodyJson;
  try {
    bodyJson = JSON.parse(txt);
  } catch {
    bodyJson = { raw: txt };
  }
  return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers.entries()), body: bodyJson };
}

async function ping() {
  setStatus('Pinging NLQ…');
  try {
    const r = await http('POST', `${API_BASE}/api/health`, {});
    out.textContent = JSON.stringify(r, null, 2);
    setStatus(r.ok ? 'Ping OK' : `Ping failed (${r.status})`);
  } catch (e) {
    out.textContent = `Ping error: ${e}`;
    setStatus('Ping error');
  }
}

async function run() {
  const v = q.value.trim();
  if (!v) {
    setStatus('Type a query first');
    return;
  }
  setStatus('Running search…');
  try {
    const r = await http('GET', `${API_BASE}/api/search-smart?q=${encodeURIComponent(v)}`);
    out.textContent = JSON.stringify(r, null, 2);
    setStatus(r.ok ? 'Search OK' : `Search failed (${r.status})`);
  } catch (e) {
    out.textContent = `Search error: ${e}`;
    setStatus('Search error');
  }
}

el('go').addEventListener('click', run);
el('ping').addEventListener('click', ping);
q.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') run();
});

setStatus('Ready.');
