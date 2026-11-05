"use client";

import { useSyncExternalStore } from "react";
import { showToast } from "@/components/ui/toast";
import { followTopic, getFollows, getServerFollows, isFollowing, subscribeFollows, unfollowTopic } from "@/lib/follow/store";

/**
 * Följ ämnet. Kept only in this browser, and only once the reader presses
 * the button. The start page then lists the topic and says when it is new.
 */
export function FollowButton({ slug, updatedAt, className }: { slug: string; updatedAt: string; className?: string }) {
  const follows = useSyncExternalStore(subscribeFollows, getFollows, getServerFollows);
  const following = isFollowing(follows, slug);

  function toggle() {
    if (following) {
      unfollowTopic(slug);
      showToast("Du följer inte längre ämnet.");
    } else {
      followTopic(slug, updatedAt);
      showToast("Du följer ämnet. Det sparas bara i den här webbläsaren.");
    }
  }

  return (
    <button type="button" className={className} onClick={toggle} data-following={following || undefined}>
      {following ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12 5 5 9-10" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
      {following ? (
        <span>
          Följer<span className="sr-only"> ämnet. Tryck för att sluta följa.</span>
        </span>
      ) : (
        "Följ ämnet"
      )}
    </button>
  );
}
