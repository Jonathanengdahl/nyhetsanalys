# Produkt

Produktbeskrivningen som sidor, datamodell och AI-flöden ska följa. Prototypen i `docs/prototyp/` visar hur det ser ut. Texten till `/metod` finns i `docs/prototyp/metod.html` och ska användas nästan ordagrant.

## Målgrupp och ton

- Svenska läsare som vill förstå en nyhet utan att läsa tio artiklar. Ingen förkunskap krävs.
- Enkel, saklig svenska. Korta meningar. Förklara facktermer. Inga värdeladdade ord, ingen ironi, inga utrop.
- Vi skriver "vi" om tjänsten och "du" till läsaren.
- Den neutrala grundbilden är alltid gratis. Man betalar för djupet och för att fråga mer.

## Vilka ämnen vi tar upp

Vi skriver bara om ämnen som många medier skriver om. Hellre färre ämnen med en ordentlig analys än många tunna.

Ett ämne blir hett när allt detta gäller:
- minst 5 oberoende källor inom 48 timmar, från minst 3 olika mediehus
- samma TT-text i flera tidningar räknas som en källa
- minst ett rikstäckande medium bevakar ämnet
- allmänintresse: politik, ekonomi, samhälle eller utrikes, aldrig privatpersoner

Tak: högst cirka 10 aktiva ämnen samtidigt. Ämnen under tröskeln har status "bevakas" och publiceras inte. Nya ämnen föreslås automatiskt men publiceras först när en människa godkänt dem.

## Ämnesmodellen

- Varje ämne har en kärnfråga, till exempel "Varför protesterar fransmännen och vad händer nu?". Den avgör vad som hör hemma på sidan.
- Ett ämne har en permanent adress, `/amne/<slug>`, till exempel `/amne/protesterna-i-frankrike`. Inget datum i adressen. Sidan uppdateras i stället för att nya sidor skapas.
- Samma kärnfråga ger samma sida. Det får aldrig finnas två sidor om samma kärnfråga.
- En mindre tråd blir en egen rubrik med ankare på huvudsidan, till exempel `#gripna`.
- En tråd blir ett delämne med egen adress bara om den har egen sökefterfrågan och tillräckligt innehåll för en egen sida. Delämnet och huvudämnet länkar till varandra.
- Ämnen som hänger ihop men har olika kärnfrågor länkas under "Hänger ihop med".
- När två ämnen slås ihop gör den ena adressen 301-omdirigering till den andra. När ett ämne byter namn omdirigeras den gamla adressen.
- Livscykel: bevakas, het, svalnar, arkiverad. En arkiverad sida ligger kvar på samma adress, visar att den inte uppdateras längre och kan väckas igen.
- En artikel har ett huvudämne men kan nämnas i fler.

## Var vi hämtar materialet

- Källistan: svenska nyhetsmedier, public service, rikstäckande och regionala tidningar samt TT. Hela listan publiceras på sajten.
- Varje källa har en etikett för typ (till exempel public service, kommersiellt nyhetsmedium, nyhetsbyrå, åsiktsmaterial), aldrig en politisk etikett.
- Landet där det händer: vi läser alltid medier i det landet.
- Andra länder: när ett ämne är stort i minst tre länder visar vi hur två eller tre av dem beskriver det.
- Bredare sökning när ett ämne är hett: myndigheter, forskare, domstolar och andra primärkällor.
- Mindre etablerade källor kan bidra med perspektiv men märks tydligt och är aldrig ensamt belägg för en uppgift.
- Läsare kan föreslå ämnen och perspektiv. Förslagen hanteras som feedback och påverkar aldrig urvalet automatiskt.

## Uppdateringsrytm

- Nya rubriker via RSS: var 15:e minut.
- Hetta per ämne: varje timme.
- Ny analys när något viktigt har ändrats, högst var 2–3 timme per ämne, plus fasta körningar kl. 06, 12 och 18. Morgonkörningen är underlag för morgonbriefen.
- Stora nyheter: inom en timme en kort ruta "Läget utvecklas" med det som är bekräftat. Full analys när bilden klarnat.

## Ämnessidan

Läsaren väljer djupnivå: 30 sekunder, 5 minuter eller Djupdykning. All text ligger i HTML:en oavsett vald nivå. Vilka delar som syns på vilken nivå framgår av prototypen (`docs/prototyp/frankrike.html`).

Delarna i ordning:
- Sidhuvud: rubrik, ingress, status (till exempel Pågår), senast uppdaterad, följ-knapp, "Fråga om ämnet", karta och nyckeltal.
- På 30 sekunder: 2–4 meningar som besvarar kärnfrågan och går att läsa fristående.
- Nytt sedan ditt senaste besök: tidsstämplade punkter.
- 01 Vad har hänt
- 02 Fakta och osäkerhet: varje uppgift med märkning och källor
- 03 Mediebilden: det källorna är överens om, där de skiljer sig, vinkelfördelningen i alla artiklar och artikel för artikel
- 04 Vem pekar ut vem?
- 05 Förklaringsmodeller: varje förklaring med vilka som står bakom den och hur väl den stöds
- 06 Siffrorna bakom
- 07 Det här saknas i debatten
- 08 Perspektivpanelen: fyra fiktiva arketyper skrivna av AI (den rödgröna, liberalen, den konservativa, nationalpopulisten) som läser samma fakta. De märks som fiktiva och representerar inga verkliga personer eller partier.
- 09 Så är sidan gjord: antal analyserade artiklar, händelser, data och länk till metoden
- Källor: numrerade, med medium, rubrik, datum och länk
- Nytt jämfört med prototypen: Frågor och svar (synliga frågor med korta svar, samma som chattens föreslagna frågor) och Rättelser (datum och vad som ändrats)

## Så analyseras en artikel

Varje artikel bedöms för sig, i åtta delar:
- Genre: nyhet, analys, reportage, ledare eller debatt
- Fakta: vilka uppgifter texten bygger på och om de stämmer med andra källor
- Urval: vad texten tar med och vad den lämnar ute
- Röster: vilka som får komma till tals och vilka som saknas
- Språk: värdeladdade ord och hur händelsen benämns, till exempel protest, upplopp eller kravall
- Rubrik mot brödtext: om rubriken säger samma sak som texten
- Siffror: om siffrorna har källa och sammanhang
- Källkvalitet: egna uppgifter, nyhetsbyrå eller andrahandskällor

Politisk placering görs bara för texter som tar ställning, alltid med motivering, på axlarna ekonomisk vänster–höger och GAL–TAN (grön, alternativ, libertär mot traditionell, auktoritär, nationalistisk). Aldrig för nyhetsartiklar och aldrig för ett helt medium.

## Osäkerhetsmärkning

| Märkning | Betyder |
|---|---|
| Bekräftat | Stöds av flera oberoende källor eller av en primärkälla, till exempel en myndighet |
| Siffror skiljer sig | Källorna anger olika siffror. Visa alla och vem som står bakom varje |
| Ändras över tid | Uppgiften har ändrats när bilden klarnat. Visa hur |
| Uppskattning | En beräkning eller bedömning, inte ett exakt mått |
| Omstritt | Kunniga källor tolkar samma sak olika. Redovisa sidorna |
| Obekräftat | Kommer från en enda källa och har inte kunnat kontrolleras |
| Falskt | Har visat sig vara fel. Förklara varför |

Märkningen visas alltid som text, inte bara som färg eller ikon.

## Startsidan

- Överst och tydligt: "Vi analyserar dagens heta nyhetsämnen." och en mening om vad det innebär (se prototypen).
- Frågefält till AI-chatten med föreslagna frågor.
- Dagens ämnen med filter: alla, inrikes, utrikes, ekonomi, politik.
- Så funkar det, våra urvalsregler och länk till metoden.
- Planerna, veckobrevet (söndagar: fem ämnen, hur de beskrevs och vad som saknades) och beta-anmälan.

## Konton och planer

| | Utan konto | Gratiskonto | Premium |
|---|---|---|---|
| Ämnessidor | 30 sek och 5 min | 30 sek och 5 min | även Djupdykning |
| AI-chatten | föreslagna frågor | plus 5 egna frågor per dag | så många frågor man vill, med tak för rimlig användning |
| Övrigt | veckobrev | följa ämnen och se vad som är nytt | notiser när följda ämnen uppdateras |

- Priset för Premium är inte bestämt. Visa "[Pris] kr/mån" tills vidare.
- Under betan är allt gratis och ingen betalning byggs.
- Kvoten för egna frågor nollställs vid midnatt svensk tid.

## AI-chatten

- Finns på startsidan (om dagens ämnen) och på varje ämnessida (om det ämnet).
- Svarar bara utifrån underlaget: ämnessidans innehåll och dess källor. Frågor om ämnen vi inte analyserat besvaras med att vi inte har analyserat det ämnet ännu.
- Föreslagna frågor har färdiga svar som tas fram i analyssteget och kostar inget per fråga.
- Egna frågor besvaras av `claude-haiku-5-5` och räknas mot kvoten. Utan konto visas en uppmaning att skapa gratiskonto. När frågorna är slut erbjuds Premium.
- Svaren hänvisar till källor med nummer, till exempel [2], som blir länkar.
- Feedbackläge: läsaren kan rapportera ett fel eller ett perspektiv som saknas. AI:n ber om källa, sparar ärendet och tackar. Den lovar aldrig att något ändras.
- Skydd: begränsa längden på frågor och historik, begränsa antal anrop per användare och IP-adress, logga kostnaden.
- Under betan (beslut 2026-10-31): chatten finns utan konto. Varje besökare får 10 egna frågor per dag, räknade under en kod som byts varje dag och inte går att föra tillbaka till IP-adressen. Hela sajten har en dagsbudget på 20 kr, och chatten pausar till midnatt om den nås. Föreslagna frågor går också via AI och räknas mot kvoten, eftersom färdiga svar tas fram först i fas 2. Frågor och svar sparas inte.

Utkast till instruktion, från prototypen:

> Du är nyhetsassistenten i en svensk tjänst för nyhetsanalys. Svara på svenska.
> Regler:
> - Svara bara utifrån UNDERLAGET. Finns svaret inte där, säg det rakt ut och föreslå vad användaren kan läsa på sidan.
> - Gäller frågan ett ämne som inte finns i underlaget: säg att vi inte har analyserat det ämnet ännu och svara inte utifrån egen kunskap.
> - Var neutral och opartisk. Ta aldrig politisk ställning och ge inga egna åsikter. Redovisa olika perspektiv sida vid sida.
> - Skilj på fakta, uppskattningar och tolkningar, och markera osäkerhet tydligt.
> - Hänvisa till källor med nummer i hakparentes, till exempel [2], när underlaget anger ett.
> - Högst 150 ord, enkel svenska, inga rubriker, ingen markdown. Punktlistor med tecknet • bara när det hjälper.
> - Lägg inte till egna uppgifter om händelser efter underlagets datum.

## Feedback och rättelser

1. Läsaren säger till i chatten eller via formulär, gärna med källa.
2. AI:n grupperar liknande synpunkter och kontrollerar dem mot källorna. Redaktionen får en sammanfattning varje dag.
3. En människa beslutar. Ingen ändring görs bara för att många skriver samma sak.
4. Rättelser och viktiga ändringar visas med datum på ämnessidan och samlat på `/rattelser`.

## Testläsare under betan

- Beta-anmälan med frivillig ruta "Jag vill vara testläsare" och frivilliga uppgifter: åldersgrupp, län och var man placerar sig politiskt. Den sista är en känslig personuppgift, se juridiken i `CLAUDE.md`.
- Målet är en blandning av åldrar, regioner och politiska hemvister.
- Belöning: ett års Premium gratis.

## Senare: bygg inte nu, men stäng inte dörren

- Morgonbrief kl. 06.30: 3–5 ämnen, cirka 3 minuter, uppläst av en AI-röst som märks som AI. I appen, som poddflöde och som pushnotis.
- Läsmeny (Aa): Ordförklaringar av/på (prickig understrykning, förklaring vid tryck), Lättläst av/på, mörkt läge, textstorlek. Planera redan nu för att ord att förklara och en lättläst version är data som analysen kan ta fram.
- Premium och betalning: Stripe på webben, appbutikernas köp i appen.
- App för iOS och Android.
- Företag (B2B): inramningsanalys för pr- och kommunikationsbyråer. Helt skild från redaktionen. Kunder kan aldrig påverka ämnessidorna.
- Skolor: klassrumsläge utan elevkonton, lektionsupplägg och licenser. Skolans undervisning ska vara saklig och allsidig, vilket passar tjänsten.
