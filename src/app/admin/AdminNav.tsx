import Link from "next/link";
import styles from "./kandidater/page.module.css";

/** Links between the admin pages. */
export function AdminNav({ current }: { current: "kandidater" | "utkast" }) {
  const items = [
    { key: "kandidater", href: "/admin/kandidater", label: "Kandidater" },
    { key: "utkast", href: "/admin/utkast", label: "Utkast och sidor" },
  ] as const;
  return (
    <nav aria-label="Redaktionen" className={styles.adminNav}>
      {items.map((item) => (
        <Link key={item.key} href={item.href} aria-current={item.key === current ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
