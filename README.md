# Frontend estático (GitHub Pages)

Publicar em: https://gustavodestefano.github.io/rastreiocarnaval/

1) Suba `index.html` e `app.js` no repositório `rastreiocarnaval`.
2) Ative GitHub Pages (branch `main`, pasta raiz).
3) A página usa Leaflet via CDN e consome o Worker:
   `https://meu-proxy-cors.rastreiocarnaval.workers.dev/?from=0&count=100`

A estrutura do JSON esperada por item é:
{
  "id": 1,
  "ds_evento": "av123",
  "dt_registro": "2025-12-18T15:00:00.000+00:00",
  "ds_posicao": { "latitude": -22.88, "longitude": -47.06, "zoom": "18" },
  "pk_uk_registro": 1
}

Os pontos são plotados por `latitude` e `longitude`.
