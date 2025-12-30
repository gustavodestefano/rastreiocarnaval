// Configurar com a URL do seu Cloudflare Worker após o deploy
const API_URL = 'https://cloudflare-worker-proxy.rastreiocarnaval.workers.dev';

const els = {
  refresh: document.getElementById('refresh'),
  btnCarregar: document.getElementById('btnCarregar'),
  btnAplicar: document.getElementById('btnAplicar'),
  evento: document.getElementById('evento'),
  count: document.getElementById('count'),
  from: document.getElementById('from'),
  lastUpdate: document.getElementById('lastUpdate'),
  diagUrl: document.getElementById('diagUrl'),
  diagHttp: document.getElementById('diagHttp'),
  diagType: document.getElementById('diagType'),
  diagCount: document.getElementById('diagCount'),
  diagSample: document.getElementById('diagSample'),
  tbody: document.getElementById('tbody'),
};

let timerId = null;

function buildUrl(fromVal, countVal) {
  const u = new URL(API_URL);
  u.searchParams.set('from', String(fromVal ?? 0));
  u.searchParams.set('count', String(countVal ?? 100));
  return u.toString();
}

async function fetchDados(fromVal, countVal) {
  const url = buildUrl(fromVal, countVal);
  els.diagUrl.textContent = url;
  try {
    const resp = await fetch(url, { mode: 'cors' });
    els.diagHttp.textContent = `${resp.status} ${resp.statusText}`;
    els.diagType.textContent = resp.headers.get('content-type') || '—';
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    renderResultados(data);
    const now = new Date();
    els.lastUpdate.textContent = now.toLocaleString('pt-BR');
  } catch (err) {
    els.diagHttp.textContent = `erro: ${err.message}`;
    els.diagType.textContent = '—';
    els.diagCount.textContent = '—';
    els.diagSample.textContent = '—';
    els.tbody.innerHTML = '<tr><td colspan="2">Falha ao carregar dados. Veja CORS/HTTP acima.</td></tr>';
  }
}

function renderResultados(data) {
  let items = [];
  if (Array.isArray(data)) items = data;
  else if (data && Array.isArray(data.items)) items = data.items;
  else if (data && Array.isArray(data.result)) items = data.result;
  else if (data && typeof data === 'object') items = Object.entries(data).map(([k, v]) => ({ chave: k, valor: v }));

  els.diagCount.textContent = String(items.length);
  els.diagSample.textContent = JSON.stringify(items[0] ?? data, null, 2);

  const rows = items.map((it, idx) => {
    const pretty = JSON.stringify(it, null, 2).replaceAll('<', '&lt;');
    return `<tr><td>${idx + 1}</td><td><pre class="mono">${pretty}</pre></td></tr>`;
  });
  els.tbody.innerHTML = rows.join('') || '<tr><td colspan="2">Sem dados.</td></tr>';
}

function startAutoRefresh() {
  const interval = Number(els.refresh.value);
  if (timerId) { clearInterval(timerId); timerId = null; }
  if (interval > 0) {
    timerId = setInterval(() => fetchDados(Number(els.from.value), Number(els.count.value)), interval);
  }
}

els.btnCarregar.addEventListener('click', () => fetchDados(Number(els.from.value), Number(els.count.value)));
els.btnAplicar.addEventListener('click', () => fetchDados(Number(els.from.value), Number(els.count.value)));
els.refresh.addEventListener('change', startAutoRefresh);

fetchDados(Number(els.from.value), Number(els.count.value));
startAutoRefresh();
