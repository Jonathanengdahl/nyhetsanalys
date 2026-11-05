"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getFollows, getServerFollows, isFollowing, isNewer, subscribeFollows } from "@/lib/follow/store";
import styles from "./FollowedTopics.module.css";

export type FollowableTopic = { slug: string; title: string; href: string; updatedAt: string };

/**
 * The topics this reader follows, with a mark on those updated since they
 * last read them. Kept in the reader's browser, so it shows only there.
 */
export function FollowedTopics({ topics }: { topics: FollowableTopic[] }) {
  const follows = useSyncExternalStore(subscribeFollows, getFollows, getServerFollows);
  const followed = topics.filter((topic) => isFollowing(follows, topic.slug));
  if (followed.length === 0) return null;

  return (
    <nav className={`rise ${styles.wrap}`} aria-labelledby="du-foljer">
      <h2 id="du-foljer" className={styles.title}>
        Ämnen du följer
      </h2>
      <ul className={styles.list}>
        {followed.map((topic) => {
          const fresh = isNewer(topic.updatedAt, follows[topic.slug].seen);
          return (
            <li key={topic.slug}>
              <Link href={topic.href} className={styles.link} transitionTypes={["nav-forward"]} data-fresh={fresh || undefined}>
                {topic.title}
                {fresh && (
                  <span className={styles.fresh}>
                    Nytt<span className="sr-only"> sedan du läste det senast</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
