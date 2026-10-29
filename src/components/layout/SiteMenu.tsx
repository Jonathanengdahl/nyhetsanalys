"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./SiteMenu.module.css";

type Item = { readonly href: string; readonly label: string };

/**
 * Header menu as a native disclosure, so it also opens without JavaScript.
 * With JavaScript it closes on navigation, on Escape and on clicks outside.
 */
export function SiteMenu({ items }: { items: readonly Item[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const menu = ref.current;
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    }
    function onClick(event: MouseEvent) {
      const menu = ref.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className={styles.menu}>
      <summary className={styles.button} aria-label="Meny">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path className={styles.open} d="M4 7h16M4 12h16M4 17h10" />
          <path className={styles.close} d="M6 6l12 12M18 6 6 18" />
        </svg>
      </summary>
      <nav aria-label="Huvudmeny" className={styles.panel}>
        <ul className={styles.list}>
          {items.map((item) => {
            const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className={styles.link} aria-current={current ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}
