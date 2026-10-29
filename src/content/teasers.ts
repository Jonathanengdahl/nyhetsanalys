import type { TopicTeaser } from "@/lib/topics/types";

// Example cards from the prototype. These topics have no page of their own.
export const teasers: TopicTeaser[] = [
  {
    key: "ukraina",
    rank: 5,
    title: "Nya samtal om Ukraina",
    accent: "sun",
    categories: ["utrikes", "politik"],
    card: {
      tags: ["Utrikes", "Politik"],
      summary:
        "Ryssland uppger att nya förhandlingar med Ukraina och USA ska hållas i Abu Dhabi. Uppgiften kommer bara från den ryska sidan.",
      uncertainty: "Obekräftat",
      sourceLine: "Källa: Euronews, 23 oktober",
    },
  },
  {
    key: "stormen-austen",
    rank: 6,
    title: "Stormen Austen",
    accent: "sky",
    categories: ["utrikes"],
    card: {
      tags: ["Utrikes"],
      summary: "Stormen drog in över nordvästra Frankrike och lämnade över 160 000 hushåll utan ström.",
      badge: "Ingen politisk vinkel",
      sourceLine: "Källa: Euronews, 23 oktober",
    },
  },
];
