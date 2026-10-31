# Designriktning: Ljus

Beslut 2026-10-31. Ersätter Nattpop från 2026-10-29, som gav för mycket intryck och var svår att läsa länge i.

Målet är att det ska vara lugnt att läsa och lätt att skumma. Texten är huvudsaken. Färg och rörelse ska hjälpa läsaren att förstå, inte pynta.

## Färg

- Vit sida, mörk text och en lila accentfärg för länkar, primära knappar, valda lägen och små markeringar.
- Färg används för data (diagram och osäkerhetsmärkning) och för små markeringar, aldrig för stora block.
- Diagrammens färger (`--series-1` till `--series-6`) delas ut i storleksordning. Ordningen är kontrollerad för färgblindhet på vit bakgrund.
- Färg bär aldrig information ensam. Varje färg har en etikett eller text bredvid sig.
- Text ska klara minst 4,5:1 i kontrast mot sin bakgrund (WCAG 2.2 AA).

## Bredd

- Mobil först. På datorn används en bred ram, upp till 1 200 px, för sidhuvud, sidfot, startsida och ämnesarkiv.
- Brödtext är aldrig bredare än cirka 70 tecken per rad (`--width-text`). På ämnessidan används platsen bredvid texten till en meny som följer med och visar var man är.
- Startsidan visar alla dagens ämnen direkt: rubriken till vänster och ämneslistan till höger på datorn, listan direkt under rubriken på mobilen.

## Typsnitt

- Onest för både rubriker och brödtext, självhostat i `src/fonts/`.
- Geist Mono bara för små tekniska etiketter: rangordning, tider, antal och märkningen AI-svar. Aldrig för löpande text.
- Rubriker i fet vikt med något tätare spärrning. Inga extra tunga vikter.
- Tusental skrivs med hårt mellanslag (550 000), så att ett tal aldrig delas mellan två rader. Datalagret sköter det, så innehållet kan skrivas med vanligt mellanslag.

## Ytor

- Avsnitt och listor skiljs åt med tunna linjer, inte med lådor.
- Mjuka grå ytor bara där något hör ihop som en enhet, till exempel ett diagram.
- Skuggor är svaga och används sparsamt, mest på det som ligger ovanpå sidan: frågeknappen, menyn och notiser.

## Framtidskänsla, fortfarande luftigt (2026-10-31)

- Ett mjukt ljus i lila, blått och rosa som rör sig långsamt bakom rubriken på startsidan, och ett svagt rutnät som tonar bort.
- Ett svagt sken i ämnets färg och samma rutnät bakom rubriken på ämnessidan.
- Kort och rader lyser upp där muspekaren är (bara med mus, aldrig på pekskärm).
- Glasyta (lätt genomskinlig och suddig bakgrund) på ämneslistan, sidhuvudet och djupväljaren.
- Medieremsan visar riktiga rubriker från artiklarna vi har jämfört. Varje medium får en neutral bokstavsbricka, aldrig sin logga.

## Rörelse

- Animationerna visar vad som händer: rubriken avkodas, artiklar samlas till ämnen, siffror rullar fram, staplar växer och avsnitt glider in när man scrollar.
- På ämnessidorna loopar ingenting. På startsidan loopar bara ljuset bakom rubriken, Live-pricken, medieremsan och bilden där artiklar samlas till ämnen. Knappen i medieremsan pausar alla, och remsan stannar när man pekar på den.
- Bilden där artiklar samlas till ämnen spelas upp när den scrollas fram.
- Sidbyten glider framåt eller bakåt (React `ViewTransition`), och sidhuvudet står still. Ämnets rubrik flyger från listan på startsidan till ämnessidan.
- Chattpanelen glider in från sidan på datorn och nerifrån på mobilen. En liten lysande prick andas medan svaret skrivs.
- Grundstilen är slutläget, så allt syns när animationer är avstängda. Med `prefers-reduced-motion` stängs all rörelse av.

## Var det finns

- `src/styles/tokens.css`: alla färger, typsnitt, avstånd och radier.
- `src/styles/globals.css`: grundstil och animationerna som globala klasser.
- `docs/design/nattpop-prototyp.html`: den tidigare riktningen. Bra för att se animationerna, men färger och typsnitt gäller inte längre.
