"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getFollows, getServerFollows, isFollowing, isNewer, markSeen, subscribeFollows } from "@/lib/follow/store";
import styles from "./sections.module.css";

/** A visit counts as read when the reader leaves after at least this long. */
const READ_AFTER_MS = 3000;

/**
 * Says whether a followed topic has been updated since the reader last read
 * it. Built in advance as the text for readers who do not follow the topic.
 * The version counts as read when the reader leaves the page.
 */
export function UpdatesNote({ slug, updatedAt }: { slug: string; updatedAt: string }) {
  const follows = useSyncExternalStore(subscribeFollows, getFollows, getServerFollows);

  useEffect(() => {
    const shownAt = Date.now();
    const record = () => {
      if (Date.now() - shownAt >= READ_AFTER_MS) markSeen(slug, updatedAt);
    };
    window.addEventListener("pagehide", record);
    return () => {
      window.removeEventListener("pagehide", record);
      record();
    };
  }, [slug, updatedAt]);

  if (!isFollowing(follows, slug)) {
    return <p className={styles.followNote}>Följ ämnet, så ser du här om det har kommit något nytt sedan ditt senaste besök.</p>;
  }
  if (isNewer(updatedAt, follows[slug].seen)) {
    return (
      <p className={styles.followNote} data-new>
        <span className={styles.followDot} aria-hidden="true" />
        Ämnet har uppdaterats sedan du läste det senast.
      </p>
    );
  }
  return <p className={styles.followNote}>Du följer ämnet och har läst den senaste versionen.</p>;
}

/** "Nytt för dig" on an update that came after the version the reader last read. */
export function NewMark({ slug, at }: { slug: string; at: string }) {
  const follows = useSyncExternalStore(subscribeFollows, getFollows, getServerFollows);
  if (!isFollowing(follows, slug) || !isNewer(at, follows[slug].seen)) return null;
  return <span className={styles.newMark}>Nytt för dig</span>;
}
