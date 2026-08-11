# 06CLUB — Site público

Next.js (App Router) + Supabase + R2. Visitante: assistir, baixar e compartilhar. Sem login/upload.

## Setup local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Banco

Rode no SQL Editor do Supabase: `sql/001_match_public_code.sql`

## Deploy no Cloudflare (Next.js = Workers + OpenNext)

Este app **não** é site estático. **Não** use a predefinição React/Vite nem Output directory `.next` no Pages clássico (isso causa o erro de arquivo > 25 MiB).

### Opção A — Workers (recomendado)

1. Cloudflare Dashboard → **Workers & Pages** → Create → **Worker** conectado ao GitHub `fe-goncalves/06.CLUB`
2. Build command: `npx opennextjs-cloudflare build`
3. Deploy command: `npx wrangler deploy` (ou use o fluxo automático do OpenNext se o painel oferecer)
4. Branch: `main`
5. Env vars (Production):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_R2_PUBLIC_URL`
   - `NEXT_PUBLIC_SITE_URL`

### Opção B — CLI

```bash
# login uma vez
npx wrangler login
npm run deploy
```

### Segurança Cloudflare (recomendado)

- Bot Fight Mode
- Rate Limiting em `/m/*`
- WAF managed rules

### Já incluso no app

- CSP / headers, middleware rate-limit, download só HTTPS, sem service_role no front
