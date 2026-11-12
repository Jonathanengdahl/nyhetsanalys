import type { Topic } from "@/lib/topics/types";

// Pilot topic, researched and fact-checked 12 November 2026.
export const arbetslosheten: Topic = {
  slug: "arbetslosheten",
  rank: 12,
  title: "Arbetslösheten lägst sedan 2023",
  titleLines: ["Arbetslösheten", "lägst sedan 2023"],
  titleSize: "large",
  accent: "mint",
  tags: ["Inrikes", "Ekonomi"],
  categories: ["inrikes", "ekonomi"],
  status: "Ny statistik",
  dek: "Arbetsförmedlingens siffror för oktober visar den lägsta arbetslösheten sedan hösten 2023. Men de som varit arbetslösa längst får inte del av förbättringen, och SCB:s mätning visar en högre nivå.",
  publishedAt: "2026-11-12T20:00:00+01:00",
  updatedAt: "2026-11-12T20:00:00+01:00",
  counts: "3 artiklar från 3 medier, 8 källor",
  card: {
    tags: ["Inrikes", "Ekonomi"],
    summary:
      "6,3 procent var inskrivna som arbetslösa i slutet av oktober, den lägsta nivån sedan hösten 2023. SCB:s mätning, som räknar på ett annat sätt, låg på 8,7 procent under tredje kvartalet.",
    highlights: [
      { value: "6,3 %", label: "inskrivna arbetslösa i oktober", uncertainty: "Bekräftat" },
      { value: "8,7 %", label: "arbetslösa enligt SCB", uncertainty: "Siffror skiljer sig" },
    ],
    sourceLine: "Källor: Arbetsförmedlingen, SCB och TT",
  },
  stats: [
    { value: "6,3 %", label: "inskrivna arbetslösa i slutet av oktober, mot 6,8 procent för ett år sedan" },
    { value: "339 000", label: "personer inskrivna som arbetslösa, ungefär 18 000 färre än för ett år sedan" },
    { value: "8,7 %", label: "arbetslösa enligt SCB:s mätning under tredje kvartalet" },
    { value: "20 nov", label: "kommer SCB:s nästa siffror" },
  ],
  summary: [
    {
      key: "Vad",
      text: "Knappt 339 000 personer var inskrivna som arbetslösa hos Arbetsförmedlingen i slutet av oktober. Det är 6,3 procent av arbetskraften och den lägsta nivån sedan hösten 2023.",
    },
    {
      key: "Var",
      text: "Arbetslösheten har minskat i alla län jämfört med för ett år sedan. Den är högst i Skåne med 8,2 procent och lägst i Norrbotten med 3,4 procent.",
    },
    {
      key: "Men",
      text: "Bland dem som varit utan arbete i två år eller mer ökar arbetslösheten något. Arbetsförmedlingen säger att de inte har fått del av den starkare arbetsmarknaden än.",
    },
    {
      key: "Två mått",
      text: "SCB mäter arbetslösheten med en urvalsundersökning och får en högre siffra, 8,7 procent under tredje kvartalet. Båda måtten visar att utvecklingen går åt samma håll.",
    },
  ],
  updates: {
    intro: "Torsdagen den 12 november",
    items: [
      {
        text: "Arbetsförmedlingen publicerade sin statistik för oktober. Andelen inskrivna arbetslösa sjönk till 6,3 procent, från 6,4 procent i september.",
        sources: [3, 1],
        at: "2026-11-12T06:00:00+01:00",
      },
      {
        text: "Arbetsförmedlingens tillförordnade prognoschef Emil Persson säger att utvecklingen går åt rätt håll, men att arbetsmarknaden inte är framme.",
        sources: [1, 8],
        at: "2026-11-12T06:00:00+01:00",
      },
    ],
  },
  openQuestions: [
    {
      id: "scb-oktober",
      question: "Visar SCB:s mätning samma sak för oktober?",
      status: "SCB publicerar nästa siffror från arbetskraftsundersökningen den 20 november. Under tredje kvartalet var arbetslösheten enligt SCB 8,7 procent, säsongsrensat och utjämnat.",
      label: "Siffror skiljer sig",
      sources: [7],
      expected: { date: "2026-11-20", event: "SCB publicerar nya siffror från arbetskraftsundersökningen" },
    },
    {
      id: "langtidsarbetslosa",
      question: "Börjar de som varit arbetslösa längst att få jobb?",
      status: "Gruppen som varit utan arbete i två år eller mer har ökat något det senaste året. Arbetsförmedlingen säger att det behövs en lång period med god konjunktur innan de får del av förbättringen.",
      label: "Ändras över tid",
      sources: [2, 8],
    },
    {
      id: "lansprognoser",
      question: "Hur väntas arbetslösheten utvecklas i länen?",
      status: "Arbetsförmedlingen publicerar nya prognoser för varje län för 2026 till 2028 i december.",
      sources: [6],
    },
  ],
  timeline: [
    {
      date: "15 oktober",
      text: "Arbetsförmedlingens statistik för september: 6,4 procent inskrivna arbetslösa.",
      sources: [4],
    },
    {
      date: "29 oktober",
      text: "Arbetsförmedlingen redovisar att arbetslösheten minskade i alla län under tredje kvartalet.",
      sources: [6],
    },
    {
      date: "3 november",
      text: "SCB redovisar tredje kvartalet: fler sysselsatta och 8,7 procent arbetslösa, säsongsrensat och utjämnat.",
      sources: [7],
    },
    {
      date: "12 november",
      text: "Arbetsförmedlingens statistik för oktober: 6,3 procent, den lägsta nivån sedan hösten 2023.",
      sources: [1, 3],
      tag: "Nytt",
    },
    {
      date: "20 november",
      text: "SCB publicerar nya siffror från arbetskraftsundersökningen.",
      sources: [7],
      tag: "Kommande",
    },
  ],
  facts: [
    {
      label: "Bekräftat",
      title: "Nivån",
      text: "Knappt 339 000 personer var inskrivna som arbetslösa i slutet av oktober, eller 6,3 procent av arbetskraften. Ett år tidigare var andelen 6,8 procent.",
      sources: [1, 2, 3],
    },
    {
      label: "Bekräftat",
      title: "Bredden",
      text: "Arbetslösheten har minskat i alla län, bland både kvinnor och män och bland både inrikes och utrikes födda, jämfört med för ett år sedan.",
      sources: [8, 6],
    },
    {
      label: "Bekräftat",
      title: "Ett år eller mer",
      text: "De som varit utan arbete i minst ett år minskade från 151 807 till 146 076 personer på ett år.",
      sources: [2],
    },
    {
      label: "Bekräftat",
      title: "Två år eller mer",
      text: "Gruppen som varit utan arbete i minst två år har ökat något. Artiklarna anger ingen siffra.",
      sources: [2, 8],
    },
    {
      label: "Siffror skiljer sig",
      title: "Två mått",
      text: "Arbetsförmedlingen räknar dem som är inskrivna, 16 till 66 år. SCB:s arbetskraftsundersökning, AKU, frågar ett urval av befolkningen 15 till 74 år och kom fram till 8,7 procent under tredje kvartalet.",
      sources: [8, 7],
    },
    {
      label: "Bekräftat",
      title: "Fler i jobb",
      text: "Enligt SCB hade 5 398 000 personer jobb under tredje kvartalet, 74 000 fler än ett år tidigare.",
      sources: [7],
    },
  ],
  media: {
    intro:
      "Vi har läst 3 artiklar från 3 medier, publicerade 12 november. Analysen gäller de enskilda artiklarna, inte mediernas samlade bevakning. TT:s text publicerades i många tidningar och räknas som en artikel. Vi hittade inga egna artiklar från SVT, Sveriges Radio, DN eller SvD.",
    agree: [
      "Arbetslösheten är den lägsta sedan hösten 2023.",
      "Andelen inskrivna arbetslösa är 6,3 procent, mot 6,8 procent för ett år sedan.",
      "Arbetsförmedlingen är källan, och prognoschefen Emil Persson är den som kommer till tals.",
    ],
    differ: [
      "Hur stor plats får de långtidsarbetslösa? TT och Bulletin tar upp dem redan i ingressen, Finwire nämner dem inte.",
      "Förklaras skillnaden mot SCB:s högre siffra? Bara TT nämner att SCB mäter på ett annat sätt.",
      "Varför sjunker arbetslösheten? Ingen artikel går längre än att citera Arbetsförmedlingen om att ekonomin går starkare.",
    ],
    framesMeta: "Andel av omnämnandena i alla 3 artiklar. Huvudfokus räknas dubbelt.",
    frames: [
      { name: "Rätt håll", percent: 55, weight: 54.5, accent: "mint" },
      { name: "De långtidsarbetslösa", percent: 18, weight: 18.2, accent: "pink" },
      { name: "Skillnader mellan län", percent: 9, weight: 9.1, accent: "sky" },
      { name: "Hur det mäts", percent: 9, weight: 9.1, accent: "sun" },
      { name: "Ekonomin", percent: 9, weight: 9.1, accent: "lime" },
    ],
    framesNote:
      "Alla tre artiklarna har den sjunkande arbetslösheten som huvudsak. Ingen artikel frågar regeringen, oppositionen eller ekonomer om vad siffrorna betyder.",
    matrixColumns: [
      { short: "Håll", full: "Rätt håll", accent: "mint" },
      { short: "Lång", full: "De långtidsarbetslösa", accent: "pink" },
      { short: "Län", full: "Skillnader mellan län", accent: "sky" },
      { short: "Mått", full: "Hur det mäts", accent: "sun" },
      { short: "Ekonomi", full: "Ekonomin", accent: "lime" },
    ],
    matrix: [
      { name: "TT", values: [2, 1, 1, 1, 1] },
      { name: "Bulletin", values: [2, 1, 0, 0, 0] },
      { name: "Finwire", values: [2, 0, 0, 0, 0] },
    ],
    matrixKey:
      "Håll: rätt håll. Lång: de långtidsarbetslösa. Län: skillnader mellan län. Mått: hur det mäts. Ekonomi: ekonomin.",
    matrixNote: "TT:s text är bredast. Finwires korta text handlar bara om att siffran sjunker.",
  },
  articles: [
    {
      outlet: "TT",
      genre: "Nyhet",
      title: "Lägsta arbetslösheten på tre år: ”Rätt håll”",
      meta: "Arvid Uddfeldt, publicerad hos bland annat GP, 12 november",
      angle: "Arbetslösheten sjunker brett, men de som varit arbetslösa längst går åt motsatt håll.",
      rows: [
        { key: "Röster", text: "Emil Persson, Arbetsförmedlingen. Inga arbetslösa, arbetsgivare eller politiker." },
        { key: "Språk och rubrik", text: "Citatet i rubriken kommer från Arbetsförmedlingen och markeras som citat. Ingressen lyfter direkt fram de långtidsarbetslösa." },
        { key: "Siffror och källor", text: "6,3 och 6,8 procent, siffror för länen och en förklaring av hur SCB mäter. Stämmer med Arbetsförmedlingens tidigare statistik." },
        { key: "Saknas", text: "SCB:s faktiska siffra, och en siffra för dem som varit arbetslösa i två år eller mer." },
      ],
      placement: "Ej placerad, eftersom det är nyhetsrapportering.",
      basis: "hela texten",
      url: "https://www.gp.se/ekonomi/lagsta-arbetslosheten-pa-tre-ar-ratt-hall.4cda00b8-6cad-5c47-9076-1be8ffe447c5",
      linkLabel: "Läs originalet",
    },
    {
      outlet: "Bulletin",
      genre: "Nyhet",
      title: "Arbetslösheten på lägsta nivån sedan 2023",
      meta: "Cecilia Aspegren, 12 november",
      angle: "Färre arbetslösa, men fler som varit utan arbete i två år eller mer.",
      rows: [
        { key: "Röster", text: "Emil Persson, Arbetsförmedlingen, via ett pressmeddelande." },
        { key: "Språk och rubrik", text: "Saklig rubrik som stämmer med texten." },
        { key: "Siffror och källor", text: "Exakta siffror för dem som varit utan arbete i minst ett år. Den enda artikeln som anger hur många färre arbetslösa det är." },
        { key: "Saknas", text: "Länen, SCB:s mätning och en siffra för dem som varit arbetslösa i två år eller mer." },
      ],
      placement: "Ej placerad, eftersom det är nyhetsrapportering.",
      basis: "hela texten",
      url: "https://bulletin.nu/arbetslosheten-pa-lagsta-nivan-sedan-2023-2",
      linkLabel: "Läs originalet",
    },
    {
      outlet: "Finwire",
      genre: "Nyhet",
      title: "Svensk arbetslöshet minskade till 6,3 procent i oktober - AF",
      meta: "Publicerad hos Börsvärlden, 12 november",
      angle: "En kort marknadsnyhet om att siffran sjunker.",
      rows: [
        { key: "Röster", text: "Emil Persson, Arbetsförmedlingen." },
        { key: "Språk och rubrik", text: "Rubriken redovisar siffran och källan." },
        { key: "Siffror och källor", text: "Oktober, september och ett år tidigare. Stämmer med de andra artiklarna." },
        { key: "Saknas", text: "De långtidsarbetslösa, länen och SCB:s mätning." },
      ],
      placement: "Ej placerad, eftersom det är nyhetsrapportering.",
      basis: "hela texten",
      url: "https://borsvarlden.com/artiklar/svensk-arbetsloshet-minskade-till-63-procent-i-oktober-af",
      linkLabel: "Läs originalet",
    },
  ],
  blame: {
    title: "Vad säger de som mäter?",
    intro: "Artiklarna bygger på Arbetsförmedlingen. Vi har inte hittat några kommentarer från regeringen eller oppositionen i det vi har läst.",
    items: [
      {
        who: "Arbetsförmedlingen",
        role: "Tillförordnade prognoschefen Emil Persson",
        text: "Säger att ekonomin går starkare och att företag anställer, men att arbetsmarknaden inte är framme. De som varit arbetslösa länge behöver en lång period av god konjunktur.",
      },
      {
        who: "SCB",
        role: "Arbetskraftsundersökningen",
        text: "Redovisar fler sysselsatta och en arbetslöshet på 8,7 procent under tredje kvartalet, säsongsrensat och utjämnat.",
      },
    ],
    sources: [1, 8, 7],
  },
  models: {
    items: [
      {
        name: "Återhämtningen är bred",
        pro: "Arbetslösheten har minskat i alla län och i alla stora grupper, och fler har jobb.",
        con: "Nivån är fortfarande högre än före nedgången, och SCB:s siffra är högre.",
        by: "Arbetsförmedlingen och de flesta artiklarna.",
      },
      {
        name: "De långtidsarbetslösa halkar efter",
        pro: "Gruppen som varit utan arbete i två år eller mer ökar, trots att arbetslösheten minskar totalt.",
        con: "De som varit utan arbete i minst ett år har ändå blivit färre.",
        by: "Arbetsförmedlingen, TT och Bulletin.",
      },
      {
        name: "Måttet spelar roll",
        pro: "SCB:s mätning ger en högre nivå än Arbetsförmedlingens, så vilket mått som citeras påverkar bilden.",
        con: "Båda måtten visar att utvecklingen går åt samma håll.",
        by: "SCB:s statistik, som TT hänvisar till.",
      },
    ],
    sources: [1, 2, 7, 8],
  },
  numbers: {
    intro: "Siffrorna kommer från Arbetsförmedlingen, som räknar inskrivna arbetslösa, och från SCB:s arbetskraftsundersökning.",
    tiles: [
      { value: "6,3 %", label: "Inskrivna arbetslösa, oktober", sub: "Arbetsförmedlingen, 16–66 år", sources: [1, 3] },
      { value: "8,7 %", label: "Arbetslösa enligt SCB, tredje kvartalet", sub: "Säsongsrensat och utjämnat, 15–74 år", sources: [7] },
      { value: "146 076", label: "Utan arbete i minst ett år", sub: "151 807 ett år tidigare", sources: [2] },
      { value: "+74 000", label: "Fler sysselsatta på ett år", sub: "SCB, tredje kvartalet", sources: [7] },
    ],
    charts: [
      {
        title: "Inskrivna arbetslösa, andel av arbetskraften",
        note: "Arbetsförmedlingens siffror vid slutet av varje månad.",
        sources: [3, 5, 4, 1],
        max: 7,
        rows: [
          { name: "Oktober 2025", value: 6.8, label: "6,8 %", accent: "muted" },
          { name: "Augusti 2026", value: 6.5, label: "6,5 %", accent: "mint" },
          { name: "September 2026", value: 6.4, label: "6,4 %", accent: "mint" },
          { name: "Oktober 2026", value: 6.3, label: "6,3 %", accent: "mint" },
        ],
      },
      {
        title: "Inskrivna arbetslösa i september, efter födelseland",
        note: "Arbetsförmedlingen har inte redovisat uppdelningen för oktober i det vi har kunnat läsa.",
        sources: [4],
        rows: [
          { name: "Utrikes födda", value: 13.2, label: "13,2 %", accent: "sky" },
          { name: "Inrikes födda", value: 4.1, label: "4,1 %", accent: "sky" },
        ],
      },
    ],
    note: "Arbetsförmedlingen räknar bara dem som är inskrivna. SCB frågar ett urval av befolkningen, och då räknas också den som söker jobb utan att vara inskriven.",
  },
  missing: [
    {
      title: "SCB:s siffra",
      text: "Ingen artikel anger SCB:s arbetslöshet, som var 8,7 procent under tredje kvartalet. TT nämner bara att SCB mäter på ett annat sätt.",
      sources: [7, 8],
    },
    {
      title: "Hur många som varit arbetslösa i två år",
      text: "Flera artiklar säger att gruppen ökar, men ingen anger hur stor den är.",
      sources: [2, 8],
    },
    {
      title: "Unga och utrikes födda",
      text: "Ingen artikel redovisar siffror för unga eller för utrikes födda i oktober. I september var 13,2 procent av de utrikes födda i arbetskraften inskrivna som arbetslösa, mot 4,1 procent av de inrikes födda.",
      sources: [4],
    },
    {
      title: "Andra röster",
      text: "Ingen artikel låter arbetslösa, arbetsgivare, fack, ekonomer eller politiker kommentera siffrorna.",
      sources: [1, 2, 3],
    },
  ],
  panel: {
    intro:
      "Fyra fiktiva arketyper läser samma vecka. De representerar inga verkliga personer eller partier, utan typiska hållningar på två axlar som används inom statsvetenskapen: ekonomisk vänster–höger och GAL–TAN. Alla får lika mycket utrymme, och var och en har sin egen blinda fläck.",
    items: [
      {
        name: "Den rödgröna",
        axes: "Ekonomisk vänster, GAL",
        x: "27%",
        y: "29%",
        accent: "mint",
        quote: "Bra att det vänder, men de som varit arbetslösa längst lämnas kvar.",
        up: "Att gruppen som varit utan arbete i två år eller mer ökar.",
        down: "Att arbetslösheten har minskat i alla län och i alla stora grupper.",
      },
      {
        name: "Liberalen",
        axes: "Ekonomisk höger, GAL",
        x: "73%",
        y: "29%",
        accent: "sky",
        quote: "Företagen anställer igen. Fler i jobb är det som räknas.",
        up: "Att 74 000 fler har jobb enligt SCB.",
        down: "Att SCB:s arbetslöshet fortfarande är 8,7 procent.",
      },
      {
        name: "Den konservativa",
        axes: "Ekonomisk höger, TAN",
        x: "73%",
        y: "71%",
        accent: "sun",
        quote: "Det går åt rätt håll, men skillnaden mellan inrikes och utrikes födda är fortfarande stor.",
        up: "Att arbetslösheten bland utrikes födda är mer än tre gånger så hög.",
        down: "Att arbetslösheten har minskat även bland utrikes födda.",
      },
      {
        name: "Nationalpopulisten",
        axes: "Ekonomisk vänster, TAN",
        x: "27%",
        y: "71%",
        accent: "pink",
        quote: "Siffrorna ser bra ut i Stockholm, men hur ser det ut i Skåne och på bruksorterna?",
        up: "Att Skåne har 8,2 procent mot 3,4 procent i Norrbotten.",
        down: "Att arbetslösheten har minskat i alla län, även i Skåne.",
      },
    ],
  },
  method: [
    "Det här är ett ämne från piloten. Analysen är skriven med AI utifrån 3 artiklar och 8 källor och har granskats mot Arbetsförmedlingens och SCB:s statistik, men inte av en redaktör.",
    "Arbetsförmedlingens pressmeddelande för oktober har vi inte kunnat läsa i original. Siffrorna för oktober kommer därför från artiklarna, och de stämmer överens med varandra.",
    "Varje artikel bedöms för sig på genre, fakta, urval, röster, språk, rubrik mot brödtext, siffror och källkvalitet. Politisk placering görs bara när en text tar ställning, och alltid med motivering.",
  ],
  faq: [
    {
      question: "Hur hög är arbetslösheten?",
      answer: "6,3 procent av arbetskraften var inskrivna som arbetslösa hos Arbetsförmedlingen i slutet av oktober, eller knappt 339 000 personer. Enligt SCB:s mätning var arbetslösheten 8,7 procent under tredje kvartalet.",
      label: "Siffror skiljer sig",
      sources: [1, 7],
    },
    {
      question: "Varför skiljer sig siffrorna?",
      answer: "Arbetsförmedlingen räknar dem som är inskrivna hos myndigheten, 16 till 66 år. SCB frågar ett urval av befolkningen 15 till 74 år, och då räknas också den som söker jobb utan att vara inskriven.",
      label: "Bekräftat",
      sources: [8, 7],
    },
    {
      question: "Minskar arbetslösheten överallt?",
      answer: "Ja, i alla län jämfört med för ett år sedan. Den är högst i Skåne med 8,2 procent och lägst i Norrbotten med 3,4 procent.",
      label: "Bekräftat",
      sources: [1, 8],
    },
    {
      question: "Vad händer med de långtidsarbetslösa?",
      answer: "De som varit utan arbete i minst ett år har blivit färre, men gruppen som varit utan arbete i två år eller mer har ökat något. Arbetsförmedlingen säger att den gruppen behöver en lång period av god konjunktur.",
      label: "Bekräftat",
      sources: [2, 8],
    },
  ],
  glossary: [
    {
      term: "Inskriven arbetslös",
      match: "inskrivna som arbetslösa",
      explanation: "En person som är anmäld hos Arbetsförmedlingen och söker jobb. Det är Arbetsförmedlingens sätt att räkna arbetslösa.",
    },
    {
      term: "Arbetskraft",
      match: "arbetskraften",
      explanation: "Alla som har ett jobb eller som söker och kan ta ett jobb. Arbetslösheten räknas som en andel av arbetskraften.",
    },
    {
      term: "Arbetskraftsundersökningen",
      match: "arbetskraftsundersökning",
      explanation: "SCB:s undersökning, AKU, där ett urval av befolkningen varje månad svarar på frågor om arbete. Den används för den officiella arbetslösheten.",
    },
    {
      term: "Säsongsrensat",
      match: "säsongsrensat",
      explanation: "Siffror där man har räknat bort variationer som återkommer varje år, till exempel sommarjobb, så att månader går att jämföra.",
    },
    {
      term: "Konjunktur",
      match: "konjunktur",
      explanation: "Hur ekonomin går just nu. God konjunktur betyder att efterfrågan är stark och att företag anställer.",
    },
  ],
  sources: [
    { name: "TT via GP", title: "Lägsta arbetslösheten på tre år: ”Rätt håll”", url: "https://www.gp.se/ekonomi/lagsta-arbetslosheten-pa-tre-ar-ratt-hall.4cda00b8-6cad-5c47-9076-1be8ffe447c5" },
    { name: "Bulletin", title: "Arbetslösheten på lägsta nivån sedan 2023", url: "https://bulletin.nu/arbetslosheten-pa-lagsta-nivan-sedan-2023-2" },
    { name: "Finwire via Börsvärlden", title: "Svensk arbetslöshet minskade till 6,3 procent i oktober - AF", url: "https://borsvarlden.com/artiklar/svensk-arbetsloshet-minskade-till-63-procent-i-oktober-af" },
    { name: "Arbetsförmedlingen", title: "Verksamhetsstatistik september 2026, 15 oktober", url: "https://mb.cision.com/Public/1326/4408321/8414e48be806a723.pdf" },
    { name: "Arbetsförmedlingen", title: "Verksamhetsstatistik augusti 2026, 17 september", url: "https://mb.cision.com/Public/1326/4396070/9d34e2eadb908f6f.pdf" },
    { name: "Arbetsförmedlingen", title: "Arbetsmarknadsläget kvartal 3 2026, 29 oktober", url: "https://arbetsformedlingen.se/statistik/analyser-och-prognoser/analys-och-utvardering/2026/arbetsmarknadslaget-kvartal-3-2026" },
    { name: "SCB", title: "Arbetskraftsundersökningarna (AKU), tredje kvartalet 2026, 3 november", url: "https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/utbud-av-arbetskraft/arbetskraftsundersokningarna-aku/pong/statistiknyhet/arbetskraftsundersokningarna-aku-tredje-kvartalet-2026/" },
    { name: "TT via Börskollen", title: "Arbetslösheten når lägsta nivån sedan 2023 – men långtidsarbetslösheten ökar", url: "https://www.borskollen.se/nyheter/27/arbetslosheten-nar-lagsta-nivan-sedan-2023-men-langtidsarbetslosheten-okar" },
  ],
  sourceGroups: [
    { title: "Analyserade artiklar", ids: [1, 2, 3] },
    { title: "Primärkällor", ids: [4, 5, 6, 7] },
    { title: "Bakgrund", ids: [8] },
  ],
  corrections: [],
};
