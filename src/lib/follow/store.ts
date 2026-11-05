/*
 * The topics a reader follows, kept only in this browser (localStorage).
 * Nothing is stored until the reader presses Följ ämnet, and nothing is sent
 * to us. For each topic we keep the version (updatedAt) the reader last saw,
 * so the site can say when a followed topic has been updated since.
 * The functions that touch storage run in the browser only.
 */

export const FOLLOW_KEY = "nyhetsanalys:folj";

export type FollowEntry = {
  /** When the reader started to follow the topic, ISO time. */
  followedAt: string;
  /** The topic's updatedAt the last time the reader read it. */
  seen: string;
};

export type Follows = Readonly<Record<string, FollowEntry>>;

const EMPTY: Follows = Object.freeze({});
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const isEntry = (value: unknown): value is FollowEntry =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as FollowEntry).followedAt === "string" &&
  typeof (value as FollowEntry).seen === "string";

/** What is stored, without anything that does not look right. */
export function parseFollows(raw: string | null): Follows {
  if (!raw) return EMPTY;
  try {
    const topics: unknown = (JSON.parse(raw) as { topics?: unknown } | null)?.topics;
    if (typeof topics !== "object" || topics === null) return EMPTY;
    const follows: Record<string, FollowEntry> = {};
    for (const [slug, entry] of Object.entries(topics)) {
      if (SLUG.test(slug) && isEntry(entry)) follows[slug] = { followedAt: entry.followedAt, seen: entry.seen };
    }
    return follows;
  } catch {
    return EMPTY;
  }
}

/** True when `updatedAt` is later than the version the reader saw. */
export function isNewer(updatedAt: string, seen: string): boolean {
  const updated = Date.parse(updatedAt);
  const read = Date.parse(seen);
  return Number.isFinite(updated) && Number.isFinite(read) && updated > read;
}

export const isFollowing = (follows: Follows, slug: string) => Object.hasOwn(follows, slug);

// One copy in memory, so useSyncExternalStore gets the same object until something changes.
let cache: Follows | null = null;
const listeners = new Set<() => void>();

function read(): Follows {
  if (cache) return cache;
  try {
    cache = parseFollows(window.localStorage.getItem(FOLLOW_KEY));
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Follows) {
  cache = next;
  try {
    if (Object.keys(next).length === 0) window.localStorage.removeItem(FOLLOW_KEY);
    else window.localStorage.setItem(FOLLOW_KEY, JSON.stringify({ version: 1, topics: next }));
  } catch {
    // Storage can be turned off or full. Following then lasts until the page is closed.
  }
  for (const listener of listeners) listener();
}

/** For useSyncExternalStore. Also follows changes made in other tabs. */
export function subscribeFollows(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== FOLLOW_KEY && event.key !== null) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const getFollows = (): Follows => read();
/** Pages are built in advance, so on the server nobody follows anything. */
export const getServerFollows = (): Follows => EMPTY;

export function followTopic(slug: string, updatedAt: string) {
  write({ ...read(), [slug]: { followedAt: new Date().toISOString(), seen: updatedAt } });
}

export function unfollowTopic(slug: string) {
  const next = { ...read() };
  delete next[slug];
  write(next);
}

/** Notes that the reader has read this version of a topic they follow. Other topics are left alone. */
export function markSeen(slug: string, updatedAt: string) {
  const current = read();
  if (!isFollowing(current, slug) || !isNewer(updatedAt, current[slug].seen)) return;
  write({ ...current, [slug]: { ...current[slug], seen: updatedAt } });
}
