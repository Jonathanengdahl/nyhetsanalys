import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/config/site";
import { robotsMetadata } from "@/lib/seo/robots";
import "@/styles/globals.css";
import styles from "./layout.module.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plex-condensed",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Robots is set here only. Child segments must not define `robots`,
// since nested metadata fields overwrite the parent's value.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.shortDescription}`,
    template: `%s – ${site.name}`,
  },
  description: site.description,
  robots: robotsMetadata(site.indexable),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      className={`${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable}`}
    >
      <body className={styles.body}>
        <a href="#innehall" className={styles.skipLink}>
          Hoppa till innehållet
        </a>
        <SiteHeader />
        <main id="innehall" className={styles.main} tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
