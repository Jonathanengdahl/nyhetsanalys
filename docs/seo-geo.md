# SEO och GEO

Målet: ämnessidorna ska ranka i Google och Bing på sökningar om ämnet och citeras av AI-tjänster som ChatGPT, Perplexity, Googles AI-översikter, Copilot och Claude. Grunden byggs in från början, inte i efterhand.

## Teknisk grund

- All text och metadata finns i serverrenderad HTML. Flikarna för djupnivå döljer bara visuellt.
- Snabba sidor som klarar Core Web Vitals: LCP under 2,5 s, INP under 200 ms, CLS under 0,1. Lätta bilder, typsnitt med `font-display: swap`, ingen onödig JavaScript.
- `<html lang="sv">`, en H1 per sida, semantiska rubriker, brödsmulor.
- Rena och stabila adresser på svenska utan datum, till exempel `/amne/protesterna-i-frankrike`. Gemener, å, ä och ö blir a, a och o, bindestreck mellan orden.
- En kanonisk adress per sida (`rel=canonical`). Filter och parametrar pekar på grundadressen.
- 301-omdirigering vid sammanslagning och namnbyte (tabellen `redirects`). Arkiverade ämnen ligger kvar.
- `sitemap.xml` med alla publika sidor och `lastmod`. `robots.txt` som pekar på sitemapen.
- En egen 404-sida som länkar till aktuella ämnen.
- IndexNow-anrop när en sida publiceras eller uppdateras, så att Bing hittar ändringen direkt. Bings index används av flera AI-tjänster.

## Metadata

- Unik titel (högst cirka 60 tecken) och beskrivning (högst cirka 155 tecken) per sida, skrivna för människor.
- Open Graph och Twitter-kort. Dynamisk delningsbild per ämne med rubrik, datum och vinkelfördelningen.
- Synligt "Senast uppdaterad" som stämmer med `dateModified`.

## Strukturerad data (JSON-LD)

- Hela sajten: `NewsMediaOrganization` med namn, logotyp, kontakt och ägare, och länkar till våra principer via `publishingPrinciples`, `correctionsPolicy`, `verificationFactCheckingPolicy`, `actionableFeedbackPolicy` och `ownershipFundingInfo` (pekar på `/metod`, `/rattelser` och `/om`). Dessutom `WebSite` med sajtens namn.
- Ämnessidan: `NewsArticle` (eller undertypen `AnalysisNewsArticle`) med rubrik, beskrivning, bild, `datePublished`, `dateModified`, utgivare, organisationen som författare och källartiklarna i `citation`. Dessutom `BreadcrumbList`.
- Frågor och svar ska synas på sidan. `FAQPage`-markup ger inte längre utökade sökresultat för vanliga sajter, men den synliga texten hjälper AI-tjänsterna.
- `ClaimReview`: Google visar inte längre faktagranskningar som utökade resultat. Lägg bara till det om vi publicerar enskilda faktagranskningar.
- Om Djupdykning blir låst för Premium: märk den låsta delen med `isAccessibleForFree: false` och `hasPart` med `cssSelector`. Annars kan Google tolka det som att robotar och människor får olika innehåll.
- Validera med Googles test för utökade resultat och med Schema.org-validatorn.

## Innehåll som rankar och citeras

- Svara direkt. "På 30 sekunder" besvarar kärnfrågan i 2–4 fristående meningar med datum och siffror med källa. Det är den text AI-tjänster helst citerar.
- Tydliga H2 och H3 med ankare (`#fakta`, `#mediebilden` och så vidare) så att enskilda avsnitt kan länkas och citeras.
- Uppgifter skrivs ut i text med källa och osäkerhetsmärkning, inte bara i grafik. Siffror i riktiga HTML-tabeller. Diagram har textalternativ.
- Synlig avsändare på varje ämnessida: AI-analys som granskas av redaktionen, ansvarig utgivare och länk till metoden.
- Förtroendesidorna ska vara lätta att hitta: Så arbetar vi, Om oss (verkliga personer, ägande, kontakt) och Rättelser.
- Intern länkning: startsidan länkar alla aktiva ämnen, ämnen länkar "Hänger ihop med", delämnen och huvudämnen länkar till varandra, och det finns ett ämnesarkiv och kategorisidor.
- Unikt värde: jämförelsen av mediebilden och analysen är vårt eget innehåll. Vi skriver aldrig om enskilda artiklar.
- Undvik det Google kallar massproducerat innehåll: bara ämnen som klarar tröskeln, inga tunna sidor, en människa godkänner nya ämnen, inga delämnen utan egen efterfrågan.

## AI-robotar

- Tillåt sök- och hämtrobotar: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot och Perplexity-User.
- Träningsrobotar (GPTBot, ClaudeBot, Google-Extended, CCBot) är ett beslut för Jonathan före lansering.
- `llms.txt` med en kort beskrivning av tjänsten och länkar till metoden och aktuella ämnen. Billigt att ha, oklart värde.

## Mätning

- Google Search Console och Bing Webmaster Tools, med sitemapen inskickad.
- GA4, som laddas först efter samtycke, med en egen kanalgrupp för AI-tjänster (chatgpt.com, perplexity.ai, claude.ai, copilot.microsoft.com, gemini.google.com). Vercel Web Analytics använder inga kakor och kan räcka under betan.
- En gång i månaden: ställ våra viktigaste frågor till AI-tjänsterna och notera om vi citeras.

## Betan och lanseringen

- Under betan: `noindex` via `SITE_INDEXABLE=false`, både som meta-tagg och `X-Robots-Tag`, och ingen blockering i robots.txt.
- Vid lansering på egen domän: slå på indexering, gör 301 från betaadressen, verifiera domänen i Search Console och Bing Webmaster Tools, skicka in sitemapen och testa den strukturerade datan.
