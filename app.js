// Lumora — static demo dashboard. All data is fictional sample data.
const DEMO_EMAIL = 'abc@gmail.com';
const DEMO_PASSWORD = 'Abc@94';
const SESSION_KEY = 'lumora-demo-session';
const DATA_KEY = 'lumora-demo-tx';

const SAMPLE_TX = [
  { date: '2026-10-03', desc: 'Incoming wire', sub: 'From: Sample Co. (demo)', type: 'Deposit', status: 'Completed', amount: 50000 },
  { date: '2026-10-02', desc: 'Withdrawal as USDT (TRC20)', sub: 'To: T-demo-wallet-01', type: 'Withdrawal', status: 'Completed', amount: -20000 },
  { date: '2026-10-01', desc: 'Network fee', sub: 'Withdrawal fee', type: 'Fee', status: 'Completed', amount: -25 },
  { date: '2026-09-29', desc: 'Incoming wire', sub: 'From: Example Ltd. (demo)', type: 'Deposit', status: 'Completed', amount: 30000 },
  { date: '2026-09-27', desc: 'Withdrawal as USDT (TRC20)', sub: 'To: T-demo-wallet-02', type: 'Withdrawal', status: 'Pending', amount: -10000 },
  { date: '2026-09-24', desc: 'Incoming wire', sub: 'From: Test Holdings (demo)', type: 'Deposit', status: 'Completed', amount: 40000 },
  { date: '2026-09-20', desc: 'Withdrawal as USDT (TRC20)', sub: 'To: T-demo-wallet-01', type: 'Withdrawal', status: 'Completed', amount: -35000 },
  { date: '2026-09-17', desc: 'Incoming wire', sub: 'From: Sample Co. (demo)', type: 'Deposit', status: 'Completed', amount: 25000 },
  { date: '2026-09-14', desc: 'Withdrawal as USDT (TRC20)', sub: 'To: T-demo-wallet-03', type: 'Withdrawal', status: 'Failed', amount: -5000 },
  { date: '2026-09-10', desc: 'Incoming wire', sub: 'From: Example Ltd. (demo)', type: 'Deposit', status: 'Completed', amount: 20000 },
  { date: '2026-09-06', desc: 'Network fee', sub: 'Withdrawal fee', type: 'Fee', status: 'Completed', amount: -25 },
  { date: '2026-09-03', desc: 'Withdrawal as USDT (TRC20)', sub: 'To: T-demo-wallet-02', type: 'Withdrawal', status: 'Completed', amount: -15000 },
  { date: '2026-09-01', desc: 'Incoming wire', sub: 'From: Test Holdings (demo)', type: 'Deposit', status: 'Completed', amount: 10000 },
];

const RECEIVE_INFO = [
  ['Beneficiary', 'Demo User (sample)'],
  ['Account number', '000000000 (demo)'],
  ['Routing', '000000000 (demo)'],
  ['Bank name', 'Example Demo Bank'],
  ['Bank address', '123 Sample Street, Demo City'],
  ['Reference', 'DEMO-ONLY'],
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function store(kind) {
  try { return window[kind]; } catch { return null; }
}
function load(kind, key) {
  try { return store(kind)?.getItem(key); } catch { return null; }
}
function save(kind, key, val) {
  try { val === null ? store(kind)?.removeItem(key) : store(kind)?.setItem(key, val); } catch {}
}

let tx = (() => {
  try { return JSON.parse(load('localStorage', DATA_KEY)) || [...SAMPLE_TX]; } catch { return [...SAMPLE_TX]; }
})();
let filter = 'all';

const fmt = (n, sign = false) =>
  (sign && n > 0 ? '+' : n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Counted toward balance: everything except failed transactions.
const settled = () => tx.filter((t) => t.status !== 'Failed');

function render() {
  const s = settled();
  const tin = s.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const tout = s.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const net = tin + tout;
  $('#balance').innerHTML = fmt(net) + ' <span class="small">USD</span>';
  $('#stat-in').textContent = fmt(tin, true);
  $('#stat-out').textContent = fmt(tout);
  $('#stat-net').textContent = fmt(net);
  $('#stat-count').textContent = tx.length;

  const kv = RECEIVE_INFO.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  $('#recv-info').innerHTML = kv;
  $('#recv-info-2').innerHTML = kv;

  $('#recent-tx').innerHTML = tx.slice(0, 6).map((t) => `
    <tr><td class="small muted">${fmtDate(t.date)}</td>
    <td>${esc(t.desc)}<div class="sub">${esc(t.sub)}</div></td>
    <td><span class="pill ${t.status}">${t.status}</span></td>
    <td class="r ${t.amount > 0 ? 'pos' : 'neg'}">${fmt(t.amount, true)}</td></tr>`).join('');

  const rows = tx.filter((t) => filter === 'all' || t.type === filter || t.status === filter);
  $('#all-tx').innerHTML = rows.length ? rows.map((t) => `
    <tr><td class="muted">${fmtDate(t.date)}</td>
    <td>${esc(t.desc)}<div class="sub">${esc(t.sub)}</div></td>
    <td><span class="pill ${t.type}">${t.type}</span></td>
    <td><span class="pill ${t.status}">${t.status}</span></td>
    <td class="r ${t.amount > 0 ? 'pos' : 'neg'}">${fmt(t.amount, true)}</td></tr>`).join('')
    : '<tr><td colspan="5" class="muted">No transactions match this filter.</td></tr>';

  renderChart();
}

function renderChart() {
  // One bar per transaction (excluding fees), oldest → newest, last 10.
  const items = settled().filter((t) => t.type !== 'Fee').slice(0, 10).reverse();
  const max = Math.max(...items.map((t) => Math.abs(t.amount)), 1);
  $('#chart').innerHTML = items.map((t) => {
    const h = Math.max(4, (Math.abs(t.amount) / max) * 85);
    const cls = t.amount > 0 ? 'pos-bg' : 'neg-bg';
    const label = (t.amount > 0 ? '+' : '-') + '$' + (Math.abs(t.amount) / 1000).toFixed(0) + 'k';
    return `<div class="bar-col"><div class="bar ${cls}" style="height:${h}%"><span class="${t.amount > 0 ? 'pos' : 'neg'}">${label}</span></div>
      <div class="lbl">${fmtDate(t.date).replace(/, \d{4}$/, '')}</div></div>`;
  }).join('');
}

function show(page) {
  $$('.page').forEach((p) => p.classList.add('hidden'));
  $('#page-' + page).classList.remove('hidden');
  $$('.sidebar nav a').forEach((a) => a.classList.toggle('active', a.dataset.page === page));
  $('#crumb-page').textContent = $(`.sidebar nav a[data-page="${page}"]`).textContent.replace(/^\S+\s/, '');
  window.scrollTo(0, 0);
}

function setView(loggedIn) {
  $('#login-view').classList.toggle('hidden', loggedIn);
  $('#app-view').classList.toggle('hidden', !loggedIn);
  if (loggedIn) { render(); show('overview'); }
}

$('#login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = $('#email').value.trim().toLowerCase() === DEMO_EMAIL && $('#password').value === DEMO_PASSWORD;
  const btn = $('#login-btn');
  $('#login-error').classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Logging in…';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Log in';
    if (!ok) { $('#login-error').classList.remove('hidden'); return; }
    save('sessionStorage', SESSION_KEY, '1');
    $('#password').value = '';
    setView(true);
  }, 700);
});

$('#logout').addEventListener('click', () => {
  save('sessionStorage', SESSION_KEY, null);
  setView(false);
});

document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-page]');
  if (nav) return show(nav.dataset.page);
  const go = e.target.closest('[data-goto]');
  if (go) return show(go.dataset.goto);
});

$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  filter = b.dataset.f;
  $$('#filters button').forEach((x) => x.classList.toggle('active', x === b));
  render();
});

$('#withdraw-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const amt = Math.round(parseFloat($('#w-amount').value) * 100) / 100;
  const addr = $('#w-addr').value.trim();
  const today = new Date().toISOString().slice(0, 10);
  tx.unshift(
    { date: today, desc: 'Withdrawal as USDT (TRC20)', sub: 'To: ' + addr, type: 'Withdrawal', status: 'Pending', amount: -amt },
    { date: today, desc: 'Network fee', sub: 'Withdrawal fee', type: 'Fee', status: 'Completed', amount: -25 },
  );
  save('localStorage', DATA_KEY, JSON.stringify(tx));
  $('#w-msg').textContent = `Demo withdrawal of ${fmt(amt)} added as Pending. No real funds moved.`;
  e.target.reset();
  render();
});

$('#reset').addEventListener('click', () => {
  tx = [...SAMPLE_TX];
  save('localStorage', DATA_KEY, null);
  render();
});

setView(load('sessionStorage', SESSION_KEY) === '1');
