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
| `ANTHROPIC_API_KEY` | Nyckel till Claude API för AI-chatten. Utan den svarar chatten att den inte är påslagen |
| `CHAT_SECRET` | Valfri. Nyckel för den dagliga koden som räknar frågor per besökare. Saknas den används `SUPABASE_SECRET_KEY` |
| `CHAT_MOCK` | Bara lokalt: `1` ger ett fast testsvar i stället för att anropa API:t. Ignoreras på Vercel |
| `CRON_SECRET` | Används från fas 2 |

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

Migrationerna för chatten (`20261031120000_chat_limits.sql`) och för läsarnas synpunkter (`20261031150000_reader_feedback.sql`) kan också klistras in i Supabase SQL Editor och köras där. De går att köra flera gånger utan fel.

Tabeller:

- `waitlist`: beta-anmälan och veckobrev. RLS är på utan publika policyer, så bara servern (hemlig nyckel) kan läsa och skriva.
- `ai_usage`: tokenförbrukning och kostnad per AI-anrop. Frågor och svar sparas inte. Dagsbudgeten räknas härifrån.
- `chat_quota`: antal chattfrågor per besökare och dag. Besökaren är en kod som byts varje dag, aldrig IP-adressen. Raderna tas bort efter två dygn.
- `topic_feedback`: svaren på "Var sidan tydlig?" längst ned på ämnessidorna, med frivillig kommentar.
- `topic_suggestions`: förslag på perspektiv som saknas. Länk till en källa krävs. Status är `ny`, `godkänd` eller `avböjd`, och en människa granskar varje förslag. Läs dem i Supabase Table Editor tills admin finns.

Tabellerna för läsarnas synpunkter sparar inte namn, e-post eller IP-adress. Utan Supabase lokalt skriver formulären bara en rad i loggen, så att de går att prova.

## AI-chatten

Chatten finns på startsidan (om dagens ämnen) och på varje ämnessida (om det ämnet). Den svarar med `claude-haiku-5-5` och bara utifrån samma underlag som sidorna visar (`src/lib/chat/material.ts`). Reglerna står i `src/lib/chat/prompt.ts`.

- Gränser och budget står i `src/config/ai.ts`: 10 egna frågor per besökare och dag, och en dagsbudget på 20 kronor för hela sajten. Når kostnaden budgeten pausar chatten till midnatt.
- Svaren strömmas från `/api/chat`. Källhänvisningar som [2] blir länkar till källan.
- På ämnessidorna kommer tre av de föreslagna frågorna från Frågor och svar. De besvaras direkt i webbläsaren med sidans färdiga svar och kostar inget.
- Lokalt utan API-nyckel: sätt `CHAT_MOCK=1` i `.env.local` för att testa panelen med ett fast svar.

## Struktur

- `src/config/site.ts`: namn, domän, ägare, kontakt och betatexten. Byt här.
- `src/styles/tokens.css`: alla färger, typsnitt, radier och avstånd (designriktningen Ljus). Komponenterna använder bara dessa variabler.
- `src/styles/globals.css`: grundstil och alla animationer som globala klasser.
- `src/fonts/`: typsnitten Onest och Geist Mono (SIL Open Font License). De ligger i projektet så att bygget inte behöver nå Google.
- `src/content/`: exempeldatan. `topics/` har de fyra ämnessidorna, `teasers.ts` exempelkorten utan egen sida.
- `src/lib/topics/`: datalagret (`getPublishedTopics`, `getTopic` med flera) och typerna för ett ämne. Samma form som tabellen `topic_versions` får i Supabase. Datalagret ser också till att tal som 550 000 aldrig delas mellan två rader. Varje ämne har också `faq` (Frågor och svar) och `glossary` (ord att förklara).
- `src/lib/og/`: delningsbilderna (`opengraph-image.tsx` på startsidan och ämnessidorna). De byggs i förväg och läser färgerna från `tokens.css`.
- `src/lib/feedback/`: Tyck till på ämnessidorna (schema och Server Actions).
- `src/content/media.ts` och `src/lib/media/`: medieregistret bakom Medierna vi läser. Varje uppgift pekar på sina källor, och `checked` är datumet då uppgifterna kontrollerades. Samma form som tabellen `sources` får i Supabase.
- `src/components/`: komponenter. `src/app/`: sidor.
- `docs/`: produkt, teknik, SEO, prototyp och designen (`docs/design/ljus.md`, och den tidigare riktningen i `docs/design/nattpop-prototyp.html`).

## Sidor

| Adress | Innehåll |
|---|---|
| `/` | Startsidan: vad vi gör, dagens ämnen med filter, beta-anmälan och veckobrev |
| `/amne/[slug]` | Ämnessida med djupnivåerna 30 sek, 5 min och Djupdykning, Frågor och svar, ordlista och Tyck till |
| `/amnen` | Alla ämnen |
| `/metod` | Så arbetar vi |
| `/medier` | Medierna vi läser: utgivare, ägare, finansiering, mediestöd och ledarsidans egen beteckning, med källa för varje uppgift |
| `/om` | Om oss och kontakt |
| `/rattelser` | Rättelser |
| `/integritet`, `/kakor` | Integritetspolicy och kakor |

## Deploy

Vercel bygger automatiskt när `main` pushas till GitHub (`Jonathanengdahl/nyhetsanalys`). Miljövariablerna sätts i Vercels projektinställningar. Under betan ska `SITE_INDEXABLE` vara `false`.
