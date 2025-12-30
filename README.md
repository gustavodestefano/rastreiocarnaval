# Frontend estático (HTML + JS)

Este pacote contém uma página estática que consome sua API via **Cloudflare Worker** (proxy com CORS).

## Passos
1. **Edite `app.js`** e substitua `API_URL` pela URL do seu Worker (ex.: `https://cloudflare-worker-proxy.<subdominio>.workers.dev`).
2. Publique como site estático:

### Opção A: GitHub Pages
- Crie um repositório e faça upload de `index.html` e `app.js`.
- Nas configurações do repositório, ative **Pages** (branch `main`, pasta raiz).
- Acesse a URL pública e teste.

### Opção B: Netlify (arrastar-e-soltar)
- Acesse https://app.netlify.com/ e crie conta.
- Clique em **Add new site → Deploy manually** e arraste a pasta com os dois arquivos.
- Teste a URL pública gerada.

### Dica
No DevTools (F12 → Network), confirme que a chamada ao Worker está retornando **200** e o cabeçalho `Access-Control-Allow-Origin`.
