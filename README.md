# Nyhetsanalys

En svensk webbtjänst som bevakar nyhetsmedier, hittar dagens heta ämnen och analyserar hur de rapporteras. Arbetsnamn. Produktbeskrivning och regler finns i `CLAUDE.md` och `docs/`.

Byggd med Next.js (App Router) och TypeScript. Driftas på Vercel.

## Kom igång

Kräver Node.js 24 eller senare.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Öppna sedan http://localhost:3000.

## Kommandon

| Kommando | Gör |
|---|---|
| `npm run dev` | Startar utvecklingsservern |
| `npm run build` | Bygger för produktion |
| `npm start` | Kör det byggda projektet |
| `npm run lint` | Kör ESLint |
| `npm run typecheck` | Kör TypeScript-kontrollen |
| `npm test` | Kör testerna (Vitest) |

## Miljövariabler

Namnen finns i `.env.example`. Riktiga värden ligger bara i `.env.local` (som inte checkas in) och i Vercels miljövariabler.

| Variabel | Betyder |
|---|---|
| `SITE_URL` | Sajtens adress utan avslutande snedstreck, till exempel Vercel-adressen under betan |
| `SITE_INDEXABLE` | `true` låter sökmotorer indexera sajten. Allt annat (standard) skickar `noindex, nofollow` som meta-tagg och som `X-Robots-Tag` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase-projektets adress |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publik nyckel (får synas i webbläsaren) |
| `SUPABASE_SECRET_KEY` | Supabase hemlig nyckel, bara på servern |
| `ANTHROPIC_API_KEY`, `CRON_SECRET` | Används från fas 2 |

## Struktur

- `src/config/site.ts`: namn, domän, ägare, kontakt. Byt här.
- `src/styles/tokens.css`: alla färger, typsnitt, radier och avstånd. Komponenterna använder bara dessa variabler.
- `src/components/`: komponenter. `src/app/`: sidor.
- `docs/`: produkt, teknik, SEO och prototyp.

## Deploy

Vercel bygger automatiskt när `main` pushas till GitHub (`Jonathanengdahl/nyhetsanalys`). Miljövariablerna sätts i Vercels projektinställningar. Under betan ska `SITE_INDEXABLE` vara `false`.
