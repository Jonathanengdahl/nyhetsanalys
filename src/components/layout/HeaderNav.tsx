"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

type Item = { readonly href: string; readonly label: string };

/** The main links in a row, for large screens. Small screens use SiteMenu. */
export function HeaderNav({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Huvudmeny" className={styles.nav}>
      <ul className={styles.navList}>
        {items.map((item) => {
          const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className={styles.navLink} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
