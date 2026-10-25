@AGENTS.md

# Nyhetsanalys

Instruktioner för Claude Code i det här repot. Filen läses in automatiskt i varje session.

## Vad vi bygger

En svensk webbtjänst (app senare) som bevakar nyhetsmedier, hittar dagens heta ämnen och analyserar hur de rapporteras. Läsaren får en neutral sammanfattning med osäkerhetsmärkning, en jämförelse av mediebilden, det som saknas i debatten och en AI-chatt som bara svarar utifrån vårt underlag. Varje ämne finns i tre djupnivåer: 30 sekunder, 5 minuter och Djupdykning.

- Arbetsnamn: Nyhetsanalys. Namn och domän är inte bestämda. Lägg namn, domän, ägare och kontaktuppgifter i en central konfigfil så att de byts på ett ställe.
- Ägare: Ascenddigital OÜ (kan ändras). Ansvarig för innehållet: Jonathan Engdahl. Kontakt: hello@ascenddigital.tech. Tjänsten har inga politiska kopplingar.
- Jonathan äger produkten och granskar. Du skriver koden. Förklara tekniska val kort och på enkel svenska.

## Underlag: läs när uppgiften berör det

- `docs/produkt.md`: ämnesurval, ämnesmodell, ämnessidans delar, analysregler, konton, chatt, feedback, senare funktioner
- `docs/teknik.md`: arkitektur, flödet från artikel till sida, datamodell, schemaläggning, kostnader
- `docs/seo-geo.md`: synlighet i Google och AI-sök. Läs den innan du bygger eller ändrar en sidmall.
- `docs/prototyp/`: klickbar prototyp, öppna `index.html` i en webbläsare. Facit för innehåll, struktur och ton, inte kod att kopiera.
- `docs/kalkyl.html`: kostnadskalkyl med antaganden om volymer och tokens

## Principer som aldrig får brytas

1. Neutralitet. Vi tar aldrig politisk ställning. Olika perspektiv redovisas sida vid sida.
2. Vi bedömer artiklar, aldrig hela medier. Politisk placering görs bara för texter som tar ställning (ledare, debatt, krönika), alltid med motivering, på två axlar: ekonomisk vänster–höger och GAL–TAN. Nyhetsartiklar placeras aldrig.
3. Vi sammanfattar och länkar. Vi återpublicerar aldrig artiklar och visar aldrig fulltext. Korta citat med källa är okej.
4. Varje uppgift har källa och osäkerhetsmärkning: Bekräftat, Siffror skiljer sig, Ändras över tid, Uppskattning, Omstritt, Obekräftat, Falskt. Hellre "det vet vi inte än" än en gissning.
5. Allt AI-skrivet märks som AI-skrivet. En människa godkänner nya ämnen och ansvarar för det som publiceras.
6. AI:n svarar bara utifrån vårt underlag och fyller aldrig i med egen kunskap.
7. Inga privatpersoner som ämnen. Bara allmänintresse: politik, ekonomi, samhälle, utrikes.
8. Ingen som betalar, varken läsare, företag eller annonsörer, kan påverka innehållet på ämnessidorna.

## Teknik

- Next.js (App Router) med TypeScript, driftas på Vercel. Koden ligger på GitHub: `Jonathanengdahl/nyhetsanalys`.
- Supabase: Postgres, inloggning och Row Level Security, i EU-region.
- Claude API: `claude-sonnet-5-5` för analys, `claude-haiku-5-5` för sortering och chatt. Prompt caching och Batch API där det går.
- Sidor renderas på servern (statiskt eller ISR) så att all text och metadata finns i HTML:en. Viktigt innehåll får aldrig kräva JavaScript.
- Innehåll är data, inte hårdkodad text. Sidmallarna läser ämnen från ett datalager: först lokala filer, sedan Supabase, med samma form.
- Design: alla färger, typsnitt, radier och avstånd som CSS-variabler (design tokens). Inga hårdkodade färger i komponenter. Designen ska göras om senare och måste gå att byta på ett ställe. Utgå från prototypens riktning tills vidare.
- Tillgänglighet: WCAG 2.2 AA, mobil först, tryckytor minst 44 px, semantisk HTML, synligt fokus. Färg bär aldrig information ensam.
- Använd aktuell dokumentation för Next.js och övriga bibliotek. Gissa inte API:er.

## Säkerhet och pengar

- Hemligheter (API-nycklar, Supabase-nycklar) finns bara i `.env.local` och i Vercels miljövariabler. Aldrig i koden, i git, i loggar eller i chatten. Håll `.env.example` uppdaterad med namn men utan värden.
- Fråga Jonathan innan du gör något som kostar pengar, raderar data, ändrar produktionsdatabasen, rör domän eller DNS, eller gör något publikt utanför betan.
- Logga tokenförbrukning per AI-jobb och ha en dagsbudget som pausar jobben om den överskrids.

## Betan

- Hela sajten är `noindex` tills vi lanserar på egen domän. Miljövariabeln `SITE_INDEXABLE` (standard `false`) styr det. När den är av skickas `noindex, nofollow` både som meta-tagg och som `X-Robots-Tag`. robots.txt blockerar inget under betan, annars ser sökmotorerna aldrig noindex.
- Märk sajten tydligt som beta.

## Arbetssätt

- Inför varje större steg: gör en kort plan och vänta på OK.
- Ett steg i taget. Commit när något fungerar. Commit-meddelanden på svenska, korta och beskrivande.
- Kod, filnamn och kodkommentarer på engelska. Allt läsaren ser är på svenska: enkel och saklig, utan värdeladdade ord.
- Kör lint, typkontroll och `npm run build` (och tester när de finns) innan du säger att något är klart.
- Avsluta varje steg med: vad som är gjort, vad Jonathan ska titta på och vad som återstår.
- Håll README.md uppdaterad: hur man startar, miljövariabler, deploy.
- När vi fattar ett nytt beslut: uppdatera den här filen eller rätt fil i `docs/`.

## Byggordning

Fas 1: betasajten med exempeldata, ingen AI ännu
1. Grund: Next.js-projekt, design tokens, sidhuvud och sidfot, konfigfil, noindex-flagga, deploy till Vercel.
   - `create-next-app` vägrar köra i en mapp som innehåller den här filen. Skapa projektet i en tillfällig undermapp och flytta upp filerna (`docs/` och `.git` får ligga kvar).
   - Den skapar en `AGENTS.md` med Next.js-regler. Lägg då till en rad med `@AGENTS.md` (utan backticks) överst i den här filen så att reglerna läses in.
2. Sidor med ämnet Protesterna i Frankrike från prototypen som exempeldata: startsida (vad vi gör, dagens ämnen, beta-anmälan), ämnessida `/amne/[slug]`, ämnesarkiv `/amnen`, Så arbetar vi `/metod`, Om oss och kontakt, Rättelser, Integritetspolicy och Kakor. Övriga ämnen i prototypen får visas som exempelkort utan egen sida.
3. SEO- och GEO-grunden enligt `docs/seo-geo.md`.

Fas 2: riktiga data
4. Supabase: tabeller, RLS, migrationer och seed med exempeldatan.
5. Insamling via RSS, sortering med Haiku, beräkning av hetta, ämneskö.
6. Analys med Sonnet, utkast, granskning, publicering.
7. Admin: godkänn, slå ihop och dela ämnen, granska utkast, rättelser, feedback, kostnader.

Fas 3: konton och chatt
8. Inloggning (Supabase Auth), gratiskonto med 5 egna frågor per dag, chatt som bara svarar utifrån underlaget, feedbackläge i chatten.

Senare: morgonbrief, läsmeny (ordförklaringar, lättläst, mörkt läge, textstorlek), Premium och betalning, app, företag (B2B), skolor.

## Juridik att bygga in

- Utgivningsbevis söks före lansering. Ansvarig utgivare och rättelser ska synas på sajten.
- GDPR: data i EU, integritetspolicy, samtycke innan icke-nödvändiga kakor sätts (till exempel GA4).
- Testläsarnas politiska självskattning är en känslig personuppgift: frivillig, uttryckligt samtycke, egen tabell med minimal åtkomst, raderas efter betan.
- Upphovsrätt: hämta bara rubrik, ingress och länk tills en jurist sagt annat. Respektera robots.txt och förbehåll mot textutvinning (TDM).
