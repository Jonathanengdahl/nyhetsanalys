import type { Topic } from "@/lib/topics/types";

// Example data from the prototype, fact-checked 29 October 2026. Updated with the state on 12 November 2026.
export const regeringsbildningen: Topic = {
  "slug": "regeringsbildningen",
  "rank": 1,
  "title": "Regeringsbildningen",
  "titleLines": [
    "Regerings-",
    "bildningen"
  ],
  "titleSize": "large",
  "accent": "lime",
  "tags": [
    "Inrikes",
    "Politik"
  ],
  "categories": [
    "inrikes",
    "politik"
  ],
  "status": "Totalpaket på fredag",
  "dek": "Två månader efter valet saknar Sverige ny regering, och riksdagen har röstat nej till två förslag till statsminister. Nu ska Magdalena Andersson och Ulf Kristersson lägga fram varsitt paket till Centerpartiet, senast fredag klockan 17.",
  "publishedAt": "2026-10-24T17:40:00+02:00",
  "updatedAt": "2026-11-12T22:00:00+01:00",
  "counts": "8 artiklar från 5 medier, 31 källor",
  "card": {
    "tags": [
      "Inrikes",
      "Politik"
    ],
    "summary": "Riksdagen har röstat nej till två förslag till statsminister. C vill ha ett totalpaket från både Andersson och Kristersson senast fredag den 13 november, och ska sedan välja.",
    "uncertainty": "Bekräftat",
    "sourceLine": "Källor: riksdagen, SVT och GP"
  },
  "stats": [
    {
      "value": "176–173",
      "label": "mandat för oppositionen och för Tidöpartierna"
    },
    {
      "value": "2 av 4",
      "label": "förslag till statsminister har röstats ned, efter fyra blir det extra val"
    },
    {
      "value": "25–324",
      "label": "ja och nej till Elisabeth Thand Ringqvist den 3 november"
    },
    {
      "value": "60 dagar",
      "label": "sedan valet utan ny regering"
    }
  ],
  "summary": [
    {
      "key": "Vad",
      "text": "Två månader efter valet har Sverige ingen ny regering. Riksdagen har röstat nej till både Magdalena Andersson (S) och Elisabeth Thand Ringqvist (C) som statsminister."
    },
    {
      "key": "Senast",
      "text": "SD har släppt kravet på ministerposter och kan släppa fram en regering med M, C, KD och L under Ulf Kristersson. Andersson vill i stället regera med C och MP, med V som stödparti."
    },
    {
      "key": "Låst",
      "text": "C säger nej till V i regeringen. V säger att det är uteslutet att släppa kravet på ministerposter."
    },
    {
      "key": "Nu",
      "text": "C vill ha ett totalpaket från både Andersson och Kristersson senast fredag den 13 november klockan 17. Kristersson rapporterar till talmannen senast den 17 november."
    }
  ],
  "updates": {
    "intro": "Sedan tisdagen den 3 november",
    "items": [
      {
        "text": "Riksdagen röstade nej till Elisabeth Thand Ringqvist (C) som statsminister, 324 mot 25. Bara C röstade ja.",
        "sources": [
          23
        ],
        "at": "2026-11-03T12:00:00+01:00"
      },
      {
        "text": "SD meddelade att partiet släpper kravet på ministerposter för att släppa fram en regering under Ulf Kristersson (M) med M, C, KD och L.",
        "sources": [
          24,
          25
        ],
        "at": "2026-11-06T12:00:00+01:00"
      },
      {
        "text": "C bad Magdalena Andersson och Ulf Kristersson att lägga fram varsitt totalpaket med politik, samarbetspartier och stöd i riksdagen.",
        "sources": [
          26,
          25
        ],
        "at": "2026-11-06T15:00:00+01:00"
      },
      {
        "text": "Talmannen gav Kristersson en vecka till för sin sondering. Andersson sade att det är bäst att inte hålla en tredje statsministeromröstning nu.",
        "sources": [
          29,
          28
        ],
        "at": "2026-11-10T12:00:00+01:00"
      },
      {
        "text": "V ställde in torsdagens möten med S, C och MP. V:s vice ordförande Ida Gabrielsson sade att partiet inte släpper kravet på ministerposter.",
        "sources": [
          30
        ],
        "at": "2026-11-12T16:30:00+01:00"
      }
    ]
  },
  "openQuestions": [
    {
      "id": "totalpaketen",
      "question": "Vilket paket väljer Centerpartiet?",
      "status": "C vill ha ett totalpaket från både Magdalena Andersson och Ulf Kristersson och ska sedan välja. C säger nej till en regering med V eller som är beroende av SD.",
      "label": "Ändras över tid",
      "sources": [
        26,
        30,
        28
      ],
      "expected": {
        "date": "2026-11-13",
        "event": "Sista tid för paketen, klockan 17"
      }
    },
    {
      "id": "kristerssons-sondering",
      "question": "Vad kommer Ulf Kristersson fram till?",
      "status": "Han sonderar om en regering med M, C, KD och L, som SD har sagt att partiet släpper fram. Han ska rapportera till talmannen senast den 17 november.",
      "sources": [
        29,
        25,
        24
      ],
      "expected": {
        "date": "2026-11-17",
        "event": "Kristersson rapporterar till talmannen"
      }
    },
    {
      "id": "v-kravet",
      "question": "Släpper V kravet på ministerposter?",
      "status": "Nej, enligt V:s vice ordförande Ida Gabrielsson. V säger att partiet går med i samtal med S, MP och C om C ställer sig bakom Anderssons paket.",
      "label": "Ändras över tid",
      "sources": [
        30
      ]
    },
    {
      "id": "sonderingen",
      "question": "Vad kommer Elisabeth Thand Ringqvist fram till?",
      "status": "Hon prövar om en regering över mitten är möjlig. Hon säger att ett sådant alternativ finns rent matematiskt, men MP kallar det en återvändsgränd och varken KD eller L har ställt sig bakom det.",
      "label": "Omstritt",
      "sources": [
        2,
        7,
        3,
        19
      ],
      "expected": {
        "date": "2026-10-26",
        "event": "Thand Ringqvist rapporterar till talmannen"
      },
      "answer": {
        "date": "2026-11-03",
        "text": "Talmannen föreslog henne som statsminister, men riksdagen röstade nej den 3 november, 324 mot 25. Bara C röstade ja.",
        "label": "Bekräftat",
        "sources": [
          23
        ]
      }
    },
    {
      "id": "budgeten",
      "question": "Vem lägger fram budgeten för 2027?",
      "status": "Finns ingen ny regering lägger övergångsregeringen fram en budget den 12 november.",
      "sources": [
        16,
        21
      ],
      "expected": {
        "date": "2026-11-12",
        "event": "Budgeten för 2027 läggs fram"
      },
      "answer": {
        "date": "2026-11-12",
        "text": "Övergångsregeringen. Den lade fram en budget utan ny politik den 12 november.",
        "label": "Bekräftat",
        "sources": [
          31
        ]
      }
    },
    {
      "id": "budgetomrostningen",
      "question": "Röstar riksdagen igenom budgeten?",
      "status": "Riksdagen röstar om budgetens ramar den 9 december. Partierna kan lägga egna budgetar till den 27 november.",
      "sources": [
        31,
        16,
        21
      ],
      "expected": {
        "date": "2026-12-09",
        "event": "Riksdagen röstar om budgeten"
      }
    },
    {
      "id": "extra-val",
      "question": "Blir det extra val?",
      "status": "Bara om riksdagen röstar nej till fyra förslag till statsminister. Då ska ett extra val hållas inom tre månader. Två förslag har hittills röstats ned.",
      "sources": [
        23,
        20
      ]
    },
    {
      "id": "andersson",
      "question": "Blir Magdalena Andersson statsminister?",
      "status": "Talmannen föreslog Magdalena Andersson (S) som statsminister i en S-regering.",
      "sources": [
        20
      ],
      "expected": {
        "date": "2026-10-15",
        "event": "Omröstning om statsminister"
      },
      "answer": {
        "date": "2026-10-15",
        "text": "Nej. Riksdagen röstade nej, 248 mot 99. Bara S röstade ja.",
        "sources": [
          20,
          22
        ]
      }
    }
  ],
  "timeline": [
    {
      "date": "13 september",
      "text": "Riksdagsval. S, V, MP och C får tillsammans 176 mandat och M, SD, KD och L 173.",
      "sources": [
        9,
        22
      ]
    },
    {
      "date": "17 september",
      "text": "Ulf Kristersson (M) begär entledigande och leder sedan en övergångsregering.",
      "sources": [
        10
      ]
    },
    {
      "date": "27 september",
      "text": "V meddelar att partiet röstar på Andreas Norlén (M) som talman.",
      "sources": [
        11
      ]
    },
    {
      "date": "28 september",
      "text": "Riksdagen väljer talman, och Andreas Norlén (M) fortsätter som talman. Magdalena Andersson (S) lämnar tillbaka sitt första sonderingsuppdrag och säger att V och M har bildat en ny konstellation.",
      "sources": [
        12,
        13,
        15,
        17
      ]
    },
    {
      "date": "2 oktober",
      "text": "Talmannen ger Andersson i uppdrag att återuppta sonderingen från den 5 oktober.",
      "sources": [
        13
      ]
    },
    {
      "date": "9 oktober",
      "text": "C har bjudit in S, V och MP till samtal. Partierna träffas utan att komma överens.",
      "sources": [
        15,
        14,
        17
      ]
    },
    {
      "date": "13 oktober",
      "text": "Andersson säger att det saknas förutsättningar för en regering som riksdagen kan tolerera. Talmannen föreslår henne ändå som statsminister i en S-regering.",
      "sources": [
        17,
        18,
        19
      ]
    },
    {
      "date": "15 oktober",
      "text": "Riksdagen röstar nej till Andersson med 248 röster mot 99. Det är det första av högst fyra försök.",
      "sources": [
        20,
        22
      ]
    },
    {
      "date": "19 oktober",
      "text": "Talmannen ger C-ledaren Elisabeth Thand Ringqvist i uppdrag att sondera, med mittenalternativet som utgångspunkt. Samma morgon, före beskedet, bjöd Jimmie Åkesson (SD) i ett öppet brev in henne till samtal.",
      "sources": [
        5,
        6,
        8
      ]
    },
    {
      "date": "20 oktober",
      "text": "Thand Ringqvist vädjar om tålamod och varnar för extra val om inget händer.",
      "sources": [
        2
      ]
    },
    {
      "date": "3 november",
      "text": "Riksdagen röstar nej till Elisabeth Thand Ringqvist (C) som statsminister, 324 mot 25. Det är det andra av högst fyra försök.",
      "sources": [
        23
      ]
    },
    {
      "date": "6 november",
      "text": "SD släpper kravet på ministerposter. C ber Andersson och Kristersson om varsitt totalpaket.",
      "sources": [
        24,
        25,
        26
      ]
    },
    {
      "date": "10 november",
      "text": "Talmannen förlänger Ulf Kristerssons sondering till den 17 november. Andersson säger att hon är redo för ett nytt sonderingsuppdrag.",
      "sources": [
        29,
        28
      ]
    },
    {
      "date": "12 november",
      "text": "Övergångsregeringen lägger fram budgeten för 2027. V ställer in mötena med S, C och MP.",
      "sources": [
        31,
        30
      ],
      "tag": "Nytt"
    },
    {
      "date": "13 november",
      "text": "Sista tid för Anderssons och Kristerssons paket till C, klockan 17.",
      "sources": [
        30,
        27
      ],
      "tag": "Kommande"
    },
    {
      "date": "17 november",
      "text": "Kristersson rapporterar till talmannen.",
      "sources": [
        29
      ],
      "tag": "Kommande"
    },
    {
      "date": "9 december",
      "text": "Riksdagen röstar om budgetens ramar.",
      "sources": [
        31,
        21
      ],
      "tag": "Kommande"
    }
  ],
  "facts": [
    {
      "label": "Bekräftat",
      "title": "Mandatfördelningen",
      "text": "S, V, MP och C har tillsammans 176 mandat och M, SD, KD och L 173. Riksdagen har 349 ledamöter, så 175 mandat krävs för egen majoritet. S är största parti med 99 mandat.",
      "sources": [
        9,
        22,
        20
      ]
    },
    {
      "label": "Bekräftat",
      "title": "Omröstningen den 15 oktober",
      "text": "Förslaget om Magdalena Andersson som statsminister i en S-regering fick 99 ja och 248 nej. Ingen avstod och två var frånvarande. Bara S röstade ja.",
      "sources": [
        20,
        22,
        17,
        19
      ]
    },
    {
      "label": "Bekräftat",
      "title": "Omröstningen den 3 november",
      "text": "Förslaget om Elisabeth Thand Ringqvist som statsminister fick 25 ja och 324 nej. Bara C röstade ja, och alla andra partier röstade nej.",
      "sources": [
        23
      ]
    },
    {
      "label": "Bekräftat",
      "title": "Regeln om extra val",
      "text": "Talmannen kan lägga fram högst fyra förslag till statsminister. Röstar riksdagen nej till alla fyra ska ett extra val hållas inom tre månader.",
      "sources": [
        20
      ]
    },
    {
      "label": "Bekräftat",
      "title": "Övergångsregeringen",
      "text": "Ulf Kristersson begärde entledigande den 17 september. Övergångsregeringen beslutar främst i löpande eller brådskande ärenden och får inte besluta om extra val.",
      "sources": [
        10
      ]
    },
    {
      "label": "Bekräftat",
      "title": "Budgeten för 2027",
      "text": "Övergångsregeringen lade fram en budget utan ny politik den 12 november. Riksdagen röstar om budgetens ramar den 9 december.",
      "sources": [
        31,
        21
      ]
    },
    {
      "label": "Ändras över tid",
      "title": "Två paket",
      "text": "C vill välja mellan ett paket från Andersson och ett från Kristersson. Andersson vill ha S, C och MP i regeringen med V som stödparti. Kristersson sonderar en regering med M, C, KD och L, som SD har sagt att partiet släpper fram.",
      "sources": [
        26,
        27,
        24,
        25
      ]
    },
    {
      "label": "Ändras över tid",
      "title": "Vem står på tur?",
      "text": "Efter omröstningen skrev nyhetsbyrån Reuters att talmannen allmänt väntades ge Ulf Kristersson nästa uppdrag. Talmannen valde i stället Elisabeth Thand Ringqvist.",
      "sources": [
        22,
        6
      ]
    }
  ],
  "media": {
    "intro": "Vi har analyserat 8 artiklar från 5 svenska medier, publicerade 19 och 20 oktober. Analysen gäller de enskilda artiklarna, inte mediernas samlade bevakning. Public service och de stora morgontidningarna saknas i urvalet, eftersom vi inte kunde läsa deras texter när exemplet togs fram. Medieanalysen gäller artiklarna från oktober. Läget, frågorna och tidslinjen är uppdaterade den 12 november.",
    "agree": [
      "Sverige saknar ny regering sex veckor efter valet, och låsningen beror på partiernas röda linjer.",
      "Flera artiklar återger Thand Ringqvists bedömning att Magdalena Andersson är den mest sannolika statsministern i ett mittenalternativ.",
      "Flera artiklar tar upp risken för ett extra val om ingen regering kan bildas."
    ],
    "differ": [
      "Är mittenalternativet en verklig möjlighet eller ett sätt att få det prövat och avfärdat?",
      "Vem bär ansvaret för låsningen: C:s röda linjer, V:s krav på inflytande eller SD:s krav på att sitta i regeringen?",
      "Är det rätt att pröva mittenalternativet? Ulf Kristersson kallar talmannens beslut logiskt och Realtids krönikör ser det som ett litet steg framåt, medan MP kallar mittenalternativet en återvändsgränd."
    ],
    "framesMeta": "Andel av omnämnandena i alla 8 artiklar. Huvudfokus räknas dubbelt.",
    "frames": [
      {
        "name": "Spelet och taktiken",
        "percent": 29,
        "weight": 29.4,
        "accent": "lime"
      },
      {
        "name": "Processen och reglerna",
        "percent": 29,
        "weight": 29.4,
        "accent": "sky"
      },
      {
        "name": "Röda linjer",
        "percent": 26,
        "weight": 26.5,
        "accent": "pink"
      },
      {
        "name": "Budget och extra val",
        "percent": 9,
        "weight": 8.8,
        "accent": "sun"
      },
      {
        "name": "Sakpolitiken",
        "percent": 6,
        "weight": 5.9,
        "accent": "mint"
      },
      {
        "name": "Väljarnas röster",
        "percent": 0,
        "weight": 0,
        "accent": "coral"
      }
    ],
    "framesNote": "Knappt sex av tio omnämnanden handlar om det politiska spelet och processen. Sakfrågorna får sex procent, och ingen artikel i urvalet låter väljare komma till tals.",
    "matrixColumns": [
      {
        "short": "Spel",
        "full": "Spelet och taktiken",
        "accent": "lime"
      },
      {
        "short": "Process",
        "full": "Processen och reglerna",
        "accent": "sky"
      },
      {
        "short": "Linjer",
        "full": "Röda linjer",
        "accent": "pink"
      },
      {
        "short": "Sak",
        "full": "Sakpolitiken",
        "accent": "mint"
      },
      {
        "short": "Budget",
        "full": "Budget och extra val",
        "accent": "sun"
      },
      {
        "short": "Väljare",
        "full": "Väljarnas röster",
        "accent": "coral"
      }
    ],
    "matrix": [
      {
        "name": "TT",
        "values": [
          1,
          1,
          2,
          1,
          0,
          0
        ]
      },
      {
        "name": "TV4 intervju",
        "values": [
          1,
          1,
          1,
          0,
          2,
          0
        ]
      },
      {
        "name": "TV4 analys",
        "values": [
          2,
          1,
          1,
          0,
          0,
          0
        ]
      },
      {
        "name": "Realtid†",
        "values": [
          2,
          1,
          1,
          0,
          1,
          0
        ]
      },
      {
        "name": "EFN",
        "values": [
          1,
          2,
          0,
          0,
          0,
          0
        ]
      },
      {
        "name": "Finwire",
        "values": [
          1,
          2,
          0,
          0,
          0,
          0
        ]
      },
      {
        "name": "TV4 reaktioner",
        "values": [
          1,
          1,
          2,
          1,
          0,
          0
        ]
      },
      {
        "name": "Finwire om SD",
        "values": [
          1,
          1,
          2,
          0,
          0,
          0
        ]
      }
    ],
    "matrixKey": "Spel: spelet och taktiken. Process: processen och reglerna. Linjer: röda linjer. Sak: sakpolitiken. Budget: budget och extra val. Väljare: väljarnas röster. † Krönika.",
    "matrixNote": "Bara två artiklar tar upp sakpolitik, och ingen låter väljare komma till tals."
  },
  "articles": [
    {
      "outlet": "TT",
      "genre": "Nyhet",
      "title": "Thand Ringqvist utesluter samarbete högerut",
      "meta": "Publicerad hos TV4, 19 oktober",
      "angle": "C-ledarens nya uppdrag och hennes gränser: inget samarbete högerut och ingen regering med V.",
      "rows": [
        {
          "key": "Röster",
          "text": "Elisabeth Thand Ringqvist (C). Inga andra partier kommer till tals."
        },
        {
          "key": "Språk och rubrik",
          "text": "Rubriken lyfter bara gränsen åt höger, medan texten visar att hon lika tydligt säger nej till V i regeringen. Hon använder inte själv ordet utesluter."
        },
        {
          "key": "Siffror och källor",
          "text": "Bygger på en intervju med TT. Inga siffror om mandat."
        },
        {
          "key": "Saknas",
          "text": "Hur många mandat ett mittenalternativ skulle få och vad KD och L säger."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://www.tv4.se/artikel/tt-261019-thandringqvist1-38b73376/thand-ringqvist-utesluter-samarbete-hogerut",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "TV4",
      "genre": "Nyhet",
      "title": "Vädjar om tålamod – för att undvika extra val: Det behövs",
      "meta": "Petter Bodelsson, 20 oktober",
      "angle": "Risken för extra val och C-ledarens vädjan om tålamod.",
      "rows": [
        {
          "key": "Röster",
          "text": "Elisabeth Thand Ringqvist (C), i TV4:s Nyhetsmorgon."
        },
        {
          "key": "Språk och rubrik",
          "text": "Rubriken återger hennes egen vädjan och stämmer med texten."
        },
        {
          "key": "Siffror och källor",
          "text": "Inga siffror. Hon säger att ett mittenalternativ finns rent matematiskt, men texten visar inte räkningen."
        },
        {
          "key": "Saknas",
          "text": "Andra partiers syn på hennes uppdrag."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://www.tv4.se/artikel/4uGnBKlHQohTzwXWGW71Kl/vaedjar-om-talamod-foer-att-undvika-extra-val-det-behoevs",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "TV4",
      "genre": "Analys",
      "title": "Nu ställs vågmästaren mot väggen",
      "meta": "Magnus Wennerberg, 19 oktober",
      "angle": "Spelet: talmannens val beskrivs som ett sätt att pröva och avfärda mittenalternativet och öka trycket på C att välja sida.",
      "rows": [
        {
          "key": "Röster",
          "text": "Skribentens egen bedömning. Partiledare citeras bara med enstaka ord, som Kristerssons icke-socialistiska majoritet."
        },
        {
          "key": "Språk och rubrik",
          "text": "Rubriken beskriver ett politiskt spel där C pressas att välja sida. Mittenalternativet kallas utskällt och närmast mytologiserat."
        },
        {
          "key": "Siffror och källor",
          "text": "Inga nya uppgifter. Bygger på analys av kända besked."
        },
        {
          "key": "Saknas",
          "text": "Vad partierna vill göra i sak om de får regera."
        }
      ],
      "placement": "Ej placerad. Analysen bedömer partiernas spel men tar inte ställning i sakfrågor.",
      "basis": "hela texten",
      "url": "https://www.tv4.se/artikel/1Um3ALdkBKnlTs4h4hq83i/nu-staells-vagmaestaren-mot-vaeggen",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "Realtid",
      "genre": "Krönika",
      "title": "Den pinsamma cirkusen i riksdagen fortsätter – ingen statsminister i sikte",
      "meta": "Viggo Cavling, 19 oktober",
      "angle": "Processen beskrivs som en cirkus, och skribenten tror på extra val.",
      "rows": [
        {
          "key": "Röster",
          "text": "Skribenten själv. Hänvisar till DN:s ledarsida, till en krönika av Alex Schulman i DN och till en fråga från SvD:s reporter."
        },
        {
          "key": "Språk och rubrik",
          "text": "Starkt värdeladdat språk, som cirkus och pinsamt, vilket är väntat i en krönika. Ordet lekstuga är ett citat ur Schulmans krönika."
        },
        {
          "key": "Siffror och källor",
          "text": "Inga nya uppgifter. Talmannen kallas Anders Norlén i texten, men heter Andreas."
        },
        {
          "key": "Saknas",
          "text": "Partiernas skäl för sina röda linjer."
        }
      ],
      "placement": "Ej placerad. Krönikan kritiserar hur partierna hanterar regeringsfrågan, men tar inte ställning i sakpolitiska frågor, så den går inte att placera på axlarna.",
      "basis": "hela texten",
      "url": "https://www.realtid.se/bors-finans/makro/den-pinsamma-cirkusen-i-riksdagen-fortsatter-ingen-statsminister-i-sikte/",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "EFN",
      "genre": "Nyhet",
      "title": "C-ledaren Elisabeth Thand Ringqvist får sonderingsuppdrag",
      "meta": "19 oktober",
      "angle": "Själva beskedet och tidplanen, med rapport till talmannen senast den 26 oktober.",
      "rows": [
        {
          "key": "Röster",
          "text": "Talmannen via Expressen, Thand Ringqvist via Aftonbladet och Ulf Kristersson (M) via SVT."
        },
        {
          "key": "Språk och rubrik",
          "text": "Neutral rubrik som stämmer med texten."
        },
        {
          "key": "Siffror och källor",
          "text": "Bygger delvis på uppgifter i andra medier, vilket anges."
        },
        {
          "key": "Saknas",
          "text": "Reaktioner från alla partier utom M."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://efn.se/c-ledaren-elisabeth-thand-ringqvist-far-sonderingsuppdrag",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "Finwire",
      "genre": "Nyhet",
      "title": "Talmannen ger sonderingsuppdraget till Elisabeth Thand Ringqvist (C)",
      "meta": "Publicerad hos Placera, 19 oktober",
      "angle": "Talmannens sätt att leda processen: telefonsamtal i stället för nya talmansrundor.",
      "rows": [
        {
          "key": "Röster",
          "text": "Talmannen Andreas Norlén, Elisabeth Thand Ringqvist (C) och Ulf Kristersson (M)."
        },
        {
          "key": "Språk och rubrik",
          "text": "Neutral och beskrivande."
        },
        {
          "key": "Siffror och källor",
          "text": "Återger Kristerssons uppgift om 176 mandat, vilket stämmer med valresultatet."
        },
        {
          "key": "Saknas",
          "text": "Vad mittenalternativet innebär och vilka partier som ingår."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://www.placera.se/telegram/talmannen-ger-sonderingsuppdraget-till-elisabeth-thand-ringqvist-c-uppdatering-20261019",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "TV4",
      "genre": "Nyhet",
      "title": "Så reagerar partiledarna på beskedet: Logiskt",
      "meta": "19 oktober",
      "angle": "Partiledarnas reaktioner på talmannens beslut.",
      "rows": [
        {
          "key": "Röster",
          "text": "S, M, V, KD, MP och L. SD:s reaktion saknas."
        },
        {
          "key": "Språk och rubrik",
          "text": "Rubriken lyfter Kristerssons ord logiskt, men texten visar en bredare bild med både välkomnande och kritiska röster."
        },
        {
          "key": "Siffror och källor",
          "text": "Inga siffror."
        },
        {
          "key": "Saknas",
          "text": "SD:s syn och hur väljarna ser på processen."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://www.tv4.se/artikel/1Tqvmdw4BOcQl3sWps4fvM/sa-reagerar-partiledarna-pa-beskedet-logiskt",
      "linkLabel": "Läs originalet"
    },
    {
      "outlet": "Finwire",
      "genre": "Nyhet",
      "title": "Åkesson bjuder in Centerpartiets ledare till samtal om regeringsbildningen",
      "meta": "Publicerad hos Placera, 19 oktober",
      "angle": "SD:s inbjudan till C och partiets linje i regeringsfrågan.",
      "rows": [
        {
          "key": "Röster",
          "text": "Jimmie Åkesson (SD), via ett öppet brev. Inga reaktioner från C."
        },
        {
          "key": "Språk och rubrik",
          "text": "Neutral rubrik. Texten återger Åkessons beskrivning av C:s röda linjer som hinder utan någon motröst."
        },
        {
          "key": "Siffror och källor",
          "text": "Bygger på det öppna brevet."
        },
        {
          "key": "Saknas",
          "text": "C:s svar på inbjudan."
        }
      ],
      "placement": "Ej placerad, eftersom det är nyhetsrapportering.",
      "basis": "hela texten",
      "url": "https://www.placera.se/telegram/akesson-bjuder-in-centerpartiets-ledare-till-samtal-om-regeringsbildningen-20261019",
      "linkLabel": "Läs originalet"
    }
  ],
  "blame": {
    "title": "Vad säger partierna?",
    "intro": "Partierna är oense om vem som måste ge sig. Här är deras senaste besked, med talmannen först och partierna i bokstavsordning. Besked från KD, L och MP är från oktober.",
    "items": [
      {
        "who": "Talmannen",
        "role": "Andreas Norlén",
        "text": "Har förlängt Ulf Kristerssons sondering till den 17 november. Ska sedan tala med alla partiledare innan han meddelar nästa steg."
      },
      {
        "who": "Centerpartiet",
        "role": "Elisabeth Thand Ringqvist",
        "text": "Vill ha ett totalpaket från både Andersson och Kristersson senast fredag den 13 november klockan 17, och ska sedan välja. Säger nej till en regering med V eller som är beroende av SD."
      },
      {
        "who": "Kristdemokraterna",
        "role": "Ebba Busch",
        "text": "Vill ha färre röda linjer, inte fler. Menar att det finns en majoritet till höger och i mitten."
      },
      {
        "who": "Liberalerna",
        "role": "Simona Mohamsson",
        "text": "Säger att det är bra, eftersom man kan ta reda på om de icke-socialistiska partierna går att samla bakom Ulf Kristersson. Om syftet är stöd för en S-ledd regering avser L ta ansvar i opposition."
      },
      {
        "who": "Miljöpartiet",
        "role": "Daniel Helldén",
        "text": "Kallar mittenalternativet en återvändsgränd och vill ha en rödgrön regering."
      },
      {
        "who": "Moderaterna",
        "role": "Ulf Kristersson",
        "text": "Ulf Kristersson sonderar om en regering med M, C, KD och L. Säger att SD:s och C:s besked gör uppgiften lite mindre svår."
      },
      {
        "who": "Socialdemokraterna",
        "role": "Magdalena Andersson",
        "text": "Vill regera med C och MP, med V som stödparti. Säger att C behöver bjuda till och att det är bäst att inte hålla en tredje statsministeromröstning nu."
      },
      {
        "who": "Sverigedemokraterna",
        "role": "Jimmie Åkesson",
        "text": "Släpper kravet på ministerposter och kan släppa fram en regering under Kristersson med M, C, KD och L. Avser att vara i opposition."
      },
      {
        "who": "Vänsterpartiet",
        "role": "Nooshi Dadgostar",
        "text": "Släpper inte kravet på ministerposter. Går med i samtal med S, MP och C om C ställer sig bakom Anderssons paket."
      }
    ],
    "sources": [
      1,
      2,
      5,
      6,
      7,
      8,
      11,
      15,
      17,
      24,
      25,
      27,
      28,
      29,
      30
    ]
  },
  "models": {
    "items": [
      {
        "name": "Jämna block",
        "pro": "Marginalen är bara tre mandat. Oppositionens majoritet kräver att alla fyra partier är med, och Tidöpartierna saknar majoritet.",
        "con": "Jämna block har tidigare lett till en regering till slut. 2018 tog det 134 dagar.",
        "by": "nyhetsrapporteringen och de flesta analyser."
      },
      {
        "name": "Röda linjer mot ytterkanterna",
        "pro": "C säger nej till både V i regeringen och SD-ministrar. Det stänger flera majoriteter som annars vore möjliga.",
        "con": "Flera andra partier har också gränser som låser. SD vill ingå i regeringen eller gå i opposition, och V kräver inflytande för sina väljare.",
        "by": "KD och SD."
      },
      {
        "name": "V:s krav på inflytande",
        "pro": "V kräver inflytande för sina väljare och vill ingå i en kommande regering. Inför talmansvalet meddelade V att partiet skulle rösta på Moderaternas kandidat Andreas Norlén.",
        "con": "V:s mandat behövs för en majoritet till vänster, så kravet speglar styrkeförhållandena efter valet.",
        "by": "S och C."
      },
      {
        "name": "SD:s regeringskrav",
        "pro": "SD vill sitta i regeringen eller gå i opposition, och C säger nej till SD-ministrar. Det gör en regering över mitten och högerut svår.",
        "con": "Tidöpartierna saknar majoritet även med SD, så kravet är inte det enda hindret till höger.",
        "by": "C och analyser i TV4."
      }
    ],
    "sources": [
      9,
      3,
      8,
      11,
      12,
      2,
      15,
      17,
      21
    ]
  },
  "numbers": {
    "intro": "Siffrorna kommer från Valmyndigheten via SVT och från riksdagen.",
    "tiles": [
      {
        "value": "176",
        "label": "Mandat för S, V, MP och C",
        "sub": "Egen majoritet, men bara om alla fyra är med",
        "sources": [
          9
        ]
      },
      {
        "value": "173",
        "label": "Mandat för M, SD, KD och L",
        "sub": "Saknar egen majoritet",
        "sources": [
          9
        ]
      },
      {
        "value": "175",
        "label": "Mandat krävs för majoritet",
        "sub": "Riksdagen har 349 ledamöter",
        "sources": [
          20
        ]
      },
      {
        "value": "60",
        "label": "Dagar sedan valet",
        "sub": "Valet hölls den 13 september",
        "sources": [
          9
        ]
      }
    ],
    "charts": [
      {
        "title": "Statsministeromröstningen 15 oktober, antal ledamöter",
        "max": 349,
        "refLine": {
          "value": 175,
          "label": "175 nej fäller förslaget"
        },
        "note": "Förslaget gällde Magdalena Andersson som statsminister i en S-regering.",
        "sources": [
          20,
          17
        ],
        "rows": [
          {
            "name": "Ja",
            "value": 99,
            "label": "99",
            "accent": "mint"
          },
          {
            "name": "Nej",
            "value": 248,
            "label": "248",
            "accent": "pink"
          },
          {
            "name": "Avstod",
            "value": 0,
            "label": "0",
            "accent": "muted"
          },
          {
            "name": "Frånvarande",
            "value": 2,
            "label": "2",
            "accent": "muted"
          }
        ]
      },
      {
        "title": "Röstandel per parti, procent",
        "max": 30,
        "note": "Valmyndighetens preliminära resultat med 94 procent av rösterna räknade, enligt SVT den 14 september.",
        "sources": [
          9
        ],
        "rows": [
          {
            "name": "S",
            "value": 28.1,
            "label": "28,1",
            "accent": "muted"
          },
          {
            "name": "M",
            "value": 19.9,
            "label": "19,9",
            "accent": "muted"
          },
          {
            "name": "SD",
            "value": 17.6,
            "label": "17,6",
            "accent": "muted"
          },
          {
            "name": "V",
            "value": 8.2,
            "label": "8,2",
            "accent": "muted"
          },
          {
            "name": "C",
            "value": 7.1,
            "label": "7,1",
            "accent": "muted"
          },
          {
            "name": "KD",
            "value": 6.2,
            "label": "6,2",
            "accent": "muted"
          },
          {
            "name": "MP",
            "value": 6.1,
            "label": "6,1",
            "accent": "muted"
          },
          {
            "name": "L",
            "value": 5.4,
            "label": "5,4",
            "accent": "muted"
          }
        ]
      }
    ],
    "note": "Oppositionen har egen majoritet på pappret men är inte överens. Tidöpartierna saknar majoritet. Därför krävs att minst ett parti rör sig över blockgränsen eller ändrar en röd linje."
  },
  "missing": [
    {
      "title": "Vad tycker väljarna?",
      "text": "Ingen av de analyserade artiklarna låter väljare komma till tals, och ingen redovisar mätningar av vilken regering väljarna vill ha nu.",
      "note": "Gäller de 8 artiklarna i urvalet.",
      "sources": []
    },
    {
      "title": "Sakfrågorna",
      "text": "Arbetslösheten, klimatet och välfärden nämns bara i förbigående, till exempel när Thand Ringqvist säger att Sverige står inför stora utmaningar på de områdena.",
      "sources": [
        1,
        7
      ]
    },
    {
      "title": "Budgeten för 2027",
      "text": "Övergångsregeringen lade fram budgeten den 12 november. Tillfälliga stöd löper ut, om inte alla åtta partier är överens. Det betyder bland annat att den sänkta skatten på bensin och diesel upphör. Det tas inte upp i de analyserade artiklarna från oktober.",
      "sources": [
        31,
        16,
        21
      ]
    },
    {
      "title": "Erfarenheterna från 2018",
      "text": "Regeringsbildningen 2018 tog 134 dagar, och övergångsregeringen fick då lägga fram budgeten. Enligt Magdalena Andersson, som då var finansminister, var det första gången i svensk historia. Jämförelsen nämns, men vad den lär oss förklaras sällan.",
      "sources": [
        21,
        6
      ]
    },
    {
      "title": "Vad en övergångsregering får göra",
      "text": "Övergångsregeringen beslutar främst i löpande eller brådskande ärenden och får inte besluta om extra val. Vilka beslut som skjuts upp medan landet väntar tas sällan upp.",
      "sources": [
        10
      ]
    }
  ],
  "panel": {
    "intro": "Fyra fiktiva arketyper läser samma vecka. De representerar inga verkliga personer eller partier, utan typiska hållningar på två axlar som används inom statsvetenskapen: ekonomisk vänster–höger och GAL–TAN. Alla får lika mycket utrymme, och var och en har sin egen blinda fläck.",
    "items": [
      {
        "name": "Den rödgröna",
        "axes": "Ekonomisk vänster, GAL",
        "x": "27%",
        "y": "29%",
        "accent": "mint",
        "quote": "Väljarna gav oppositionen majoritet. Då ska den majoriteten få regera, och alla partier som behövs för den ska ha inflytande.",
        "up": "Att S, V, MP och C har 176 mandat och att en regering till vänster behöver alla fyra.",
        "down": "Att C står fast vid sitt nej till V i regeringen, och att även en majoritet till vänster kräver kompromisser."
      },
      {
        "name": "Liberalen",
        "axes": "Ekonomisk höger, GAL",
        "x": "73%",
        "y": "29%",
        "accent": "sky",
        "quote": "Sverige behöver en bred regering över mitten. Den kräver att partierna släpper sina prestigefrågor, inte sina värderingar.",
        "up": "Att ett mittenalternativ rent matematiskt skulle ha majoritet, som Thand Ringqvist säger.",
        "down": "Att varken KD eller L har ställt sig bakom ett sådant alternativ."
      },
      {
        "name": "Den konservativa",
        "axes": "Ekonomisk höger, TAN",
        "x": "73%",
        "y": "71%",
        "accent": "sun",
        "quote": "En regering som hänger på både V och C blir instabil. Pröva först en icke-socialistisk regering innan det blir extra val.",
        "up": "Att 248 ledamöter röstade nej till Andersson och att en icke-socialistisk majoritet finns om C är med.",
        "down": "Att Tidöpartierna själva bara har 173 mandat och att C har sagt nej till SD-ministrar."
      },
      {
        "name": "Nationalpopulisten",
        "axes": "Ekonomisk vänster, TAN",
        "x": "27%",
        "y": "71%",
        "accent": "pink",
        "quote": "Partierna förhandlar om poster medan vanligt folk väntar på en regering som tar tag i jobben och tryggheten.",
        "up": "Att landet saknar ny regering sex veckor efter valet och att ett av de största partierna hålls utanför.",
        "down": "Att även SD:s krav på ministerposter bidrar till låsningen."
      }
    ]
  },
  "method": [
    "Det här ämnet togs fram som exempel i betan och uppdaterades i piloten den 12 november. Läget, frågorna och tidslinjen bygger på 31 källor. Medieanalysen gäller fortfarande 8 artiklar från oktober. Texterna är skrivna med AI och har inte granskats av en redaktör.",
    "Varje artikel bedöms för sig på genre, fakta, urval, röster, språk, rubrik mot brödtext, siffror och källkvalitet. Politisk placering görs bara när en text tar ställning, och alltid med motivering. Axlarna är ekonomisk vänster–höger och GAL–TAN.",
    "Nyhetsbyråtexter som publiceras i flera tidningar räknas som en källa. SVT, Sveriges Radio, DN och SvD saknas i urvalet eftersom vi inte kunde läsa deras texter om sonderingen när exemplet togs fram. Det begränsar analysen."
  ],
  "faq": [
    {
      "question": "Varför har Sverige ingen ny regering?",
      "answer": "Oppositionen, alltså S, V, MP och C, har 176 mandat och Tidöpartierna, alltså M, SD, KD och L, har 173. Det krävs 175 mandat för egen majoritet, men partiernas röda linjer gör att ingen sida har kunnat enas om en regering.",
      "sources": [
        9,
        20
      ]
    },
    {
      "question": "Hur gick omröstningen om Magdalena Andersson?",
      "answer": "Riksdagen röstade nej till Magdalena Andersson (S) som statsminister den 15 oktober, med 248 nej mot 99 ja. Ingen avstod och två var frånvarande. Bara S röstade ja.",
      "label": "Bekräftat",
      "sources": [
        20,
        22,
        17,
        19
      ]
    },
    {
      "question": "Blir det extra val?",
      "answer": "Det kan bli det. Talmannen kan lägga fram högst fyra förslag till statsminister. Röstar riksdagen nej till alla fyra ska ett extra val hållas inom tre månader. Två förslag har hittills röstats ned.",
      "label": "Bekräftat",
      "sources": [
        20,
        23
      ]
    },
    {
      "question": "Vad gör Elisabeth Thand Ringqvist nu?",
      "answer": "Riksdagen röstade nej till henne som statsminister den 3 november. Nu vill C ha ett totalpaket från både Magdalena Andersson och Ulf Kristersson senast fredag den 13 november, och ska sedan välja mellan dem.",
      "label": "Bekräftat",
      "sources": [
        23,
        26,
        30
      ]
    },
    {
      "question": "Vad händer med budgeten för 2027?",
      "answer": "Övergångsregeringen lade fram en budget utan ny politik den 12 november. Partierna kan lägga egna budgetar till den 27 november, och riksdagen röstar om budgetens ramar den 9 december.",
      "label": "Bekräftat",
      "sources": [
        31,
        21
      ]
    }
  ],
  "glossary": [
    {
      "term": "Tidöpartierna",
      "match": "tidöparti",
      "explanation": "Samlingsnamn för M, SD, KD och L. Namnet kommer från Tidöavtalet, som partierna slöt på Tidö slott 2022."
    },
    {
      "term": "Talman",
      "match": "talman",
      "explanation": "Riksdagens ordförande. Efter ett val leder talmannen arbetet med att bilda regering och föreslår statsminister."
    },
    {
      "term": "Övergångsregering",
      "match": "övergångsregering",
      "explanation": "Den avgående regeringen, som sköter landet tills en ny regering är på plats."
    },
    {
      "term": "Sondering",
      "match": "sondering",
      "explanation": "När talmannen ger en partiledare i uppdrag att undersöka vilken regering som kan få stöd i riksdagen."
    },
    {
      "term": "Mandat",
      "match": "mandat",
      "explanation": "En plats i riksdagen. Riksdagen har 349 mandat, så 175 krävs för egen majoritet."
    },
    {
      "term": "Statsministeromröstning",
      "match": "omröstning",
      "explanation": "Riksdagens omröstning om talmannens förslag till statsminister. Förslaget faller om mer än hälften av ledamöterna röstar nej."
    }
  ],
  "sources": [
    {
      "name": "TT via TV4",
      "title": "Thand Ringqvist utesluter samarbete högerut",
      "url": "https://www.tv4.se/artikel/tt-261019-thandringqvist1-38b73376/thand-ringqvist-utesluter-samarbete-hogerut"
    },
    {
      "name": "TV4",
      "title": "Vädjar om tålamod för att undvika extra val",
      "url": "https://www.tv4.se/artikel/4uGnBKlHQohTzwXWGW71Kl/vaedjar-om-talamod-foer-att-undvika-extra-val-det-behoevs"
    },
    {
      "name": "TV4",
      "title": "Analys: Nu ställs vågmästaren mot väggen",
      "url": "https://www.tv4.se/artikel/1Um3ALdkBKnlTs4h4hq83i/nu-staells-vagmaestaren-mot-vaeggen"
    },
    {
      "name": "Realtid",
      "title": "Den pinsamma cirkusen i riksdagen fortsätter",
      "url": "https://www.realtid.se/bors-finans/makro/den-pinsamma-cirkusen-i-riksdagen-fortsatter-ingen-statsminister-i-sikte/"
    },
    {
      "name": "EFN",
      "title": "C-ledaren Elisabeth Thand Ringqvist får sonderingsuppdrag",
      "url": "https://efn.se/c-ledaren-elisabeth-thand-ringqvist-far-sonderingsuppdrag"
    },
    {
      "name": "Finwire via Placera",
      "title": "Talmannen ger sonderingsuppdraget till Elisabeth Thand Ringqvist (C)",
      "url": "https://www.placera.se/telegram/talmannen-ger-sonderingsuppdraget-till-elisabeth-thand-ringqvist-c-uppdatering-20261019"
    },
    {
      "name": "TV4",
      "title": "Så reagerar partiledarna på beskedet",
      "url": "https://www.tv4.se/artikel/1Tqvmdw4BOcQl3sWps4fvM/sa-reagerar-partiledarna-pa-beskedet-logiskt"
    },
    {
      "name": "Finwire via Placera",
      "title": "Åkesson bjuder in Centerpartiets ledare till samtal",
      "url": "https://www.placera.se/telegram/akesson-bjuder-in-centerpartiets-ledare-till-samtal-om-regeringsbildningen-20261019"
    },
    {
      "name": "SVT",
      "title": "Rysarjämnt i valet, oppositionen leder knappt",
      "url": "https://www.svt.se/nyheter/inrikes/rysarjamnt-i-valet-oppositionen-leder-knappt"
    },
    {
      "name": "Regeringskansliet",
      "title": "Statsministern leder en övergångsregering",
      "url": "https://regeringen.se/artiklar/2026/09/statsministern-leder-en-overgangsregering/"
    },
    {
      "name": "TV4",
      "title": "V röstar på Norlén som talman",
      "url": "https://www.tv4.se/artikel/2pHNJjvIA8v88Rr7FC2D5m/v-koer-oever-s-stoettar-norlen"
    },
    {
      "name": "Finwire via Placera",
      "title": "Socialdemokraterna lämnar sonderingsuppdraget efter V:s besked",
      "url": "https://www.placera.se/telegram/socialdemokraterna-lamnar-sonderingsuppdraget-efter-v-s-besked-20260928"
    },
    {
      "name": "Direkt via Placera",
      "title": "Andersson får uppgift att återuppta sonderingsuppdraget",
      "url": "https://www.placera.se/telegram/politik-andersson-far-uppgift-ateruppta-sonderingsuppdrag--norln-20261002"
    },
    {
      "name": "TV4",
      "title": "Direktflöde: Rödgröna partierna möts på fredag",
      "url": "https://www.tv4.se/just-nu/45LiRzJfXoe4j1KJPdZUIQ/rodgrona-partierna-mots-pa-fredag"
    },
    {
      "name": "TV4",
      "title": "Analys: Thand Ringqvist konsultar åt S",
      "url": "https://www.tv4.se/artikel/4WUkJD9OVZGCV5v4wpwtM8/thand-ringqvist-c-konsultar-at-socialdemokraterna"
    },
    {
      "name": "TV4",
      "title": "Regeringen förbereder övergångsbudget",
      "url": "https://www.tv4.se/artikel/4WBi30KOaBFtclHvzY0r4N/regeringen-foerbereder-oevergangsbudget-foersvaret-far-mer-pengar"
    },
    {
      "name": "HurBra",
      "title": "Magdalena Andersson kan inte bilda regering",
      "url": "https://hurbra.se/magdalena-andersson-kan-inte-bilda-regering/"
    },
    {
      "name": "Direkt via Placera",
      "title": "Andersson (S) väntas falla i statsministeromröstning",
      "url": "https://www.placera.se/telegram/politik-andersson-s-vantas-falla-i-statsministeromrostning-20261013"
    },
    {
      "name": "Finwire via Placera",
      "title": "Busch: Samtal pågår om möjlig mitten-högerregering",
      "url": "https://www.placera.se/telegram/busch-samtal-pagar-om-mojlig-mitten-hogerregering-20261013"
    },
    {
      "name": "Riksdagen",
      "title": "No to Magdalena Andersson (SocDem) as Prime Minister",
      "url": "https://www.riksdagen.se/en/news/articles/2026/oct/15/no-to-magdalena-andersson-socdem-as-prime_cmsd2ab1134-a03c-4be2-b345-af0aacff33d3en/"
    },
    {
      "name": "Dagens PS",
      "title": "Ödesdatumet: Då får M göra budgeten på walk-over",
      "url": "https://www.dagensps.se/varlden/politik/odesdatumet-da-far-m-gora-budgeten-pa-walk-over/"
    },
    {
      "name": "Reuters via Oman Observer",
      "title": "Swedish parliament rejects Andersson as prime minister",
      "url": "https://www.omanobserver.om/article/1197877/world/europe/swedish-parliament-rejects-andersson-as-prime-minister"
    },
    {
      "name": "Riksdagen",
      "title": "Nej till Elisabeth Thand Ringqvist (C) som statsminister, 3 november",
      "url": "https://www.riksdagen.se/sv/aktuellt/aktuelltnotiser/2026/nov/3/nej-till-elisabeth-thand-ringqvist-c-som_cms6afacb7c-be00-432a-b75e-37e169872323sv/"
    },
    {
      "name": "HurBra",
      "title": "SD släpper regeringskravet, 6 november",
      "url": "https://hurbra.se/?p=45302"
    },
    {
      "name": "GP",
      "title": "Centerpartiet kräver ”totalpaket” av M och S, 6 november",
      "url": "https://www.gp.se/politik/centerpartiet-kraver-totalpaket-av-m-och-s-pa-en-vecka.a68c2af2-bf70-5dbf-9b26-035f90283906"
    },
    {
      "name": "Centerpartiet",
      "title": "Nu behöver statsministeralternativen lägga sina totalpaket på bordet, 6 november",
      "url": "https://www.centerpartiet.se/nyheter/arkiv-2026/2026-11-06-centerpartiet-nu-behover-statsministeralternativen-lagga-sina-totalpaket-pa-bordet"
    },
    {
      "name": "SVT",
      "title": "Andersson (S): Centerpartiet behöver ”bjuda till” nu, 10 november",
      "url": "https://www.svt.se/nyheter/inrikes/andersson-s-centerpartiet-behover-bjuda-till-nu"
    },
    {
      "name": "TT via GP",
      "title": "Andersson redo för nytt regeringsförsök, 10 november",
      "url": "https://www.gp.se/nyheter/sverige/andersson-det-ror-pa-sig-behover-mer-tid.60f3bdc7-e7b2-5cb8-976a-9a3b6037d5e1"
    },
    {
      "name": "TV4",
      "title": "Kristersson får en vecka till, 10 november",
      "url": "https://www.tv4.se/artikel/rNVZzMXpbK2nIp4Psmd7Y/kristersson-far-en-vecka-till-skyldighet-gentemot-medborgarna"
    },
    {
      "name": "SVT",
      "title": "V utesluter att backa efter C-ledarens nya deadline, 12 november",
      "url": "https://svt.se/nyheter/inrikes/v-utesluter-att-backa-efter-c-ledarens-nya-deadline"
    },
    {
      "name": "Regeringskansliet",
      "title": "Budgetpropositionen för 2027 på fem minuter, 12 november",
      "url": "https://www.regeringen.se/artiklar/2026/11/budgetpropositionen-for-2027-pa-fem-minuter/"
    }
  ],
  "sourceGroups": [
    {
      "title": "Analyserade artiklar",
      "ids": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ]
    },
    {
      "title": "Händelser och bakgrund",
      "ids": [
        9,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        21,
        22,
        24,
        25,
        27,
        28,
        29,
        30
      ]
    },
    {
      "title": "Primärkällor",
      "ids": [
        10,
        20,
        23,
        26,
        31
      ]
    }
  ],
  "corrections": []
};
