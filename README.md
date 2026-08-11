# 06CLUB — Site público

Next.js (App Router) + Supabase + R2. Visitante: assistir, baixar e compartilhar. Sem login/upload.

## Setup local

```bash
cp .env.example .env.local
# Preencha as variáveis (mesmas do app Expo, prefixo NEXT_PUBLIC_)
npm install
npm run dev
```

## Banco

Rode no SQL Editor do Supabase: `sql/001_match_public_code.sql`  
Sem isso, links `/m/XXXXX` (5 chars) não resolvem; UUID em `/m/<uuid>` ainda funciona.

### Cloudflare Pages — Build settings

- **Framework preset:** Next.js (or None)
- **Build command:** `npm run build`
- **Install command:** `npm ci` (ou `npm install` se o ci falhar)
- **Deploy / Production branch:** `main`
- Não use “Retry” de um deploy antigo: crie um **novo deploy** do último commit de `main`.

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_R2_PUBLIC_URL`, `NEXT_PUBLIC_SITE_URL`

### Segurança no Cloudflare (recomendado)

- Bot Fight Mode / Super Bot Fight
- Rate Limiting nas rotas `/m/*` (ex.: 60 req/min por IP)
- WAF managed rules

### Segurança no app (já incluso)

- Headers: CSP, X-Frame-Options, nosniff, COOP, Permissions-Policy
- Middleware: rate limit básico + bloqueio de paths suspeitos
- Download: apenas HTTPS + cooldown no client
- Sem `service_role` / secrets de escrita no front
- `.env*` fora do git (só `.env.example`)

## Escopo

Este site **não** substitui o app admin (upload de vídeos). Admin remoto = build EAS (APK/TestFlight), não Expo Go em LAN.
