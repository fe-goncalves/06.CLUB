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

## Deploy (Cloudflare Pages)

1. Conecte este repositório
2. Framework: Next.js (ou OpenNext Cloudflare em produção)
3. Env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_R2_PUBLIC_URL`
   - `NEXT_PUBLIC_SITE_URL`

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
