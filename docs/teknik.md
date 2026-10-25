# Teknik

Beslut och riktlinjer. Detaljerna bestämmer du (Claude Code) när vi kommer dit: föreslå, motivera kort och fråga om det kostar pengar.

## Översikt

- Next.js-appen innehåller den publika sajten, admin på `/admin` och API-vägar för jobb och chatt.
- Supabase: databas, inloggning och fillagring. Row Level Security på alla tabeller. EU-region.
- Schemalagda jobb anropar skyddade API-vägar som kräver den hemliga token i `CRON_SECRET`.
- Claude API anropas bara från servern, aldrig från webbläsaren.

## Vercel-plan

- Hobby räcker för den första statiska betan, men planen är bara för icke-kommersiellt bruk och tillåter cron-jobb högst en gång per dygn.
- Innan insamlingen startar: byt till Pro (cron varje minut) eller låt Supabase Cron starta jobben. Fråga Jonathan först, det kostar pengar.
- Dela upp långa jobb i steg, till exempel en artikel per anrop, så att varje funktion håller sig inom Vercels tidsgränser.

## Från artikel till publicerad sida

1. Insamling, var 15:e minut: läs RSS från källistan. Spara rubrik, ingress, länk, källa och publiceringstid. Ingen fulltext. Ta bort dubbletter: samma adress räknas en gång, och samma TT-text i flera tidningar räknas som en källa. Identifiera oss med en egen user agent och följ robots.txt.
2. Sortering med `claude-haiku-5-5`: kategori, land och genre. Jämför mot listan över bevakade ämnen (kärnfråga och nyckelord) och föreslå ett befintligt ämne eller ett nytt. Embeddings med pgvector kan läggas till senare om träffsäkerheten behöver det.
3. Hetta, varje timme: räkna oberoende källor, mediehus och rikstäckande medier de senaste 48 timmarna mot tröskeln i `docs/produkt.md`. Uppdatera status och lägg nya heta ämnen i ämneskön i admin.
4. Analys med `claude-sonnet-5-5`: först varje artikel för sig (åtta delar, politisk placering bara för texter som tar ställning), sedan hela ämnet: sidans delar, föreslagna frågor med svar, frågor och svar, ord att förklara. Utdata är JSON som valideras mot ett schema innan den sparas. Ogiltig utdata sparas aldrig.
5. Granskning: utkastet visas i admin bredvid den publicerade versionen, med skillnaderna markerade.
6. Publicering: sparas som ny version och sidan byggs om direkt (on-demand revalidation).

Nya ämnen publiceras först när Jonathan godkänt dem. Uppdateringar av godkända ämnen publiceras automatiskt om de klarar de automatiska kontrollerna och granskas löpande i efterhand. Automatisk publicering ska gå att stänga av per ämne, och varje ämne ska gå att backa till en tidigare version med ett klick.

Analysen körs när något viktigt har ändrats (högst var 2–3 timme per ämne), vid de fasta tiderna 06, 12 och 18, och snabbt vid stora nyheter för rutan "Läget utvecklas".

## Kostnader

- Prompt caching för allt som är lika mellan anrop: instruktioner, källistan, ämnets underlag i chatten.
- Batch API för det som inte är bråttom, till exempel omanalys av äldre artiklar.
- Logga tokens och kostnad per jobb och per ämne. Dagsbudget som pausar AI-jobben och varnar Jonathan.
- Jonathan sätter ett utgiftstak i Anthropic Console.
- Riktpriser per miljon tokens, kontrollera aktuella priser innan du räknar: Haiku 5.5 0,10 USD in och 0,50 USD ut, Sonnet 5.5 2 USD in och 10 USD ut. Webbsökning kostar 10 USD per 1 000 sökningar. Antaganden om volymer finns i `docs/kalkyl.html`.

## Datamodell (utkast)

- `sources`: medier med namn, mediehus, typ, land, språk, RSS-adress, rikstäckande ja/nej
- `articles`: adress, källa, rubrik, ingress, publiceringstid, språk, genre, fingeravtryck för TT-text, huvudämne
- `topics`: slug, titel, kärnfråga, status (bevakas, het, svalnar, arkiverad), kategori, länder, föräldraämne för delämnen, tider
- `topic_articles`: koppling mellan ämne och artikel, huvudämne ja/nej
- `article_analyses`: analys per artikel, med politisk placering och motivering när den görs
- `topic_versions`: hela ämnessidans innehåll som JSON per version, status (utkast, publicerad, tillbakadragen), modell, kostnad, granskad av, tider
- `topic_updates`: punkterna i "Nytt sedan ditt senaste besök", med tid
- `redirects`: gammal slug till ny slug (301)
- `feedback`: ämne, text, källa, grupp, status, beslut
- `corrections`: ämne, datum, vad som ändrats och varför. Publik.
- `profiles`: plan (gratis eller premium) och roll (läsare eller admin)
- `chat_usage`: användare, dag, antal frågor, tokens
- `waitlist`: e-post, samtycken, testläsare ja/nej. Testläsarnas känsliga uppgifter i en egen tabell med strängare åtkomst.
- `ai_jobs`: logg med jobbtyp, status, tokens, kostnad och fel

Ämnessidans JSON följer delarna i `docs/produkt.md`. Exempeldatan i fas 1 ska ha exakt samma form, så att bytet till Supabase bara byter datakälla.

## Miljövariabler

`ANTHROPIC_API_KEY`, Supabase-adress och publik nyckel (klient), Supabase hemlig nyckel (bara server), `SITE_URL`, `SITE_INDEXABLE` och `CRON_SECRET`. Värdena finns aldrig i repot.

## Kvalitet

- TypeScript i strict-läge. Validera all AI-utdata och alla formulär mot scheman.
- Tester för logiken som avgör vad som publiceras: hetta, dubbletter, ämnestilldelning och schemavalidering.
- Röktest i webbläsare för de viktigaste sidorna.
