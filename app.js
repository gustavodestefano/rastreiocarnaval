// Frontend mínimo (Leaflet + fetch no Worker)
const API_URL = 'https://47lwzq8u74.execute-api.sa-east-1.amazonaws.com/'; // seu Worker

// Mapa base centrado em Campinas
const map = L.map('map').setView([-22.90, -47.06], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const layer = L.layerGroup().addTo(map);
const $ = id => document.getElementById(id);

async function carregar() {
  $('status').textContent = 'Carregando…';
  layer.clearLayers();
  const from = Number($('from').value) || 0;
  const count = Number($('count').value) || 100;
  const url = new URL(API_URL);
  url.searchParams.set('from', String(from));
  url.searchParams.set('count', String(count));
  try {
    const resp = await fetch(url.toString(), { mode: 'cors' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const dados = await resp.json();
    const pontos = Array.isArray(dados) ? dados : (dados.items || dados.result || []);

    const bounds = [];
    for (const it of pontos) {
      const pos = it?.ds_posicao;
      const lat = Number(pos?.latitude);
      const lon = Number(pos?.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const m = L.marker([lat, lon]).addTo(layer);
        const evento = it?.ds_evento ?? '—';
        const quando = it?.dt_registro ?? '—';
        m.bindPopup(`<b>${evento}</b><br>${quando}`);
        bounds.push([lat, lon]);
      }
    }
    if (bounds.length) map.fitBounds(bounds, { padding: [20, 20] });
    $('status').textContent = `OK (${pontos.length} itens)`;
  } catch (e) {
    $('status').textContent = 'Erro: ' + e.message;
  }
}

$('btn').addEventListener('click', carregar);
carregar();
