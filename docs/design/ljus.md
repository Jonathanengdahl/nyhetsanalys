# Designriktning: Ljus

Beslut 2026-10-31. Ersätter Nattpop från 2026-10-29, som gav för mycket intryck och var svår att läsa länge i.

Målet är att det ska vara lugnt att läsa och lätt att skumma. Texten är huvudsaken. Färg och rörelse ska hjälpa läsaren att förstå, inte pynta.

## Färg

- Vit sida, mörk text och en lila accentfärg för länkar, primära knappar, valda lägen och små markeringar.
- Färg används för data (diagram och osäkerhetsmärkning) och för små markeringar, aldrig för stora block.
- Diagrammens färger (`--series-1` till `--series-6`) delas ut i storleksordning. Ordningen är kontrollerad för färgblindhet på vit bakgrund.
- Färg bär aldrig information ensam. Varje färg har en etikett eller text bredvid sig.
- Text ska klara minst 4,5:1 i kontrast mot sin bakgrund (WCAG 2.2 AA).

## Typsnitt

- Onest för både rubriker och brödtext, självhostat i `src/fonts/`.
- Rubriker i fet vikt med något tätare spärrning. Inga extra tunga vikter.
- Tusental skrivs med hårt mellanslag (550 000), så att ett tal aldrig delas mellan två rader. Datalagret sköter det, så innehållet kan skrivas med vanligt mellanslag.

## Ytor

- Avsnitt och listor skiljs åt med tunna linjer, inte med lådor.
- Mjuka grå ytor bara där något hör ihop som en enhet, till exempel ett diagram.
- Skuggor är svaga och används sparsamt, mest på det som ligger ovanpå sidan: frågeknappen, menyn och notiser.

## Rörelse

- Animationerna visar vad som händer: rubriken avkodas, artiklar samlas till ämnen, siffror rullar fram, staplar växer och avsnitt glider in när man scrollar.
- På ämnessidorna loopar ingenting. På startsidan finns tre lugna loopar: Live-pricken, textremsan som rullar och bilden där artiklar samlas till ämnen. Linjen som sveper över bilden går bara en gång.
- Grundstilen är slutläget, så allt syns när animationer är avstängda. Med `prefers-reduced-motion` stängs all rörelse av.

## Var det finns

- `src/styles/tokens.css`: alla färger, typsnitt, avstånd och radier.
- `src/styles/globals.css`: grundstil och animationerna som globala klasser.
- `docs/design/nattpop-prototyp.html`: den tidigare riktningen. Bra för att se animationerna, men färger och typsnitt gäller inte längre.
