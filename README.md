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
| `SITE_URL` | Sajtens adress utan avslutande snedstreck. Saknas den på Vercel används projektets produktionsadress (`VERCEL_PROJECT_PRODUCTION_URL`, som Vercel sätter själv) |
| `SITE_INDEXABLE` | `true` låter sökmotorer indexera sajten. Allt annat (standard) skickar `noindex, nofollow` som meta-tagg och som `X-Robots-Tag` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase-projektets adress |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publik nyckel (får synas i webbläsaren) |
| `SUPABASE_SECRET_KEY` | Supabase hemlig nyckel, bara på servern |
| `ANTHROPIC_API_KEY`, `CRON_SECRET` | Används från fas 2 |

## Databas (Supabase)

Projektet ligger i Supabase i regionen North EU (Stockholm). Databasändringar görs bara som migrationsfiler i `supabase/migrations/` och versionshanteras i git.

Första gången på en ny dator (kräver inloggning i webbläsaren och databaslösenordet):

```bash
npx supabase login
```

```bash
npx supabase link --project-ref sceexddpqpzewpymuocz
```

Kör nya migrationer mot databasen:

```bash
npx supabase db push
```

Tabeller i fas 1:

- `waitlist`: beta-anmälan och veckobrev. RLS är på utan publika policyer, så bara servern (hemlig nyckel) kan läsa och skriva.

## Struktur

- `src/config/site.ts`: namn, domän, ägare, kontakt och betatexten. Byt här.
- `src/styles/tokens.css`: alla färger, typsnitt, radier och avstånd (designriktningen Nattpop). Komponenterna använder bara dessa variabler.
- `src/styles/globals.css`: grundstil och alla animationer som globala klasser.
- `src/fonts/`: typsnitten Big Shoulders och Onest (SIL Open Font License). De ligger i projektet så att bygget inte behöver nå Google.
- `src/content/`: exempeldatan. `topics/` har de fyra ämnessidorna, `teasers.ts` exempelkorten utan egen sida.
- `src/lib/topics/`: datalagret (`getPublishedTopics`, `getTopic` med flera) och typerna för ett ämne. Samma form som tabellen `topic_versions` får i Supabase.
- `src/components/`: komponenter. `src/app/`: sidor.
- `docs/`: produkt, teknik, SEO, prototyp och designen (`docs/design/nattpop-prototyp.html`).

## Sidor

| Adress | Innehåll |
|---|---|
| `/` | Startsidan: vad vi gör, dagens ämnen med filter, beta-anmälan och veckobrev |
| `/amne/[slug]` | Ämnessida med djupnivåerna 30 sek, 5 min och Djupdykning |
| `/amnen` | Alla ämnen |
| `/metod` | Så arbetar vi |
| `/om` | Om oss och kontakt |
| `/rattelser` | Rättelser |
| `/integritet`, `/kakor` | Integritetspolicy och kakor |

## Deploy

Vercel bygger automatiskt när `main` pushas till GitHub (`Jonathanengdahl/nyhetsanalys`). Miljövariablerna sätts i Vercels projektinställningar. Under betan ska `SITE_INDEXABLE` vara `false`.
