export const TOAST_EVENT = "nyhetsanalys:toast";

/** Shows a short message in the shared status area (see Toaster). Browser only. */
export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

/** Messages for features that are planned but not built yet. */
export const comingSoon = {
  chat: "Chatten finns på startsidan och på varje ämnessida.",
  follow: "Att följa ämnen kräver ett konto. Det kommer senare under betan.",
} as const;

export type ComingSoonFeature = keyof typeof comingSoon;
