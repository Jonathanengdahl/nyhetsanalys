import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { BetaBar } from "@/components/layout/BetaBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Spotlight } from "@/components/ui/Spotlight";
import { Toaster } from "@/components/ui/Toaster";
import { site } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { robotsMetadata } from "@/lib/seo/robots";
import { JsonLd } from "@/components/seo/JsonLd";
import styles from "./layout.module.css";

// Self-hosted variable fonts (SIL Open Font License, see src/fonts/).
// Onest is for headings and text; Geist Mono only for small technical labels.
// tokens.css decides where each is used.
const onest = localFont({
  src: "../fonts/onest-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-onest",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const geistMono = localFont({
  src: "../fonts/geist-mono-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

// Robots is set here only. Child segments must not define `robots`,
// since nested metadata fields overwrite the parent's value.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.shortDescription}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: robotsMetadata(site.indexable),
  openGraph: {
    siteName: site.name,
    locale: "sv_SE",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language} className={`${onest.variable} ${geistMono.variable}`}>
      <body className={styles.body}>
        <a href="#innehall" className={styles.skipLink}>
          Hoppa till innehållet
        </a>
        {site.beta.enabled && <BetaBar />}
        <SiteHeader />
        <main id="innehall" className={styles.main} tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <Toaster />
        <Spotlight />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
