import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { analysisEnabled } from "@/config/analysis";
import { formatDayAndTime } from "@/lib/format";
import { allowedDecisions } from "@/lib/admin/decisions";
import { listPages, type PageRow } from "@/lib/admin/pages";
import { AdminNav } from "../AdminNav";
import styles from "../kandidater/page.module.css";
import { decidePage } from "./actions";

export const metadata: Metadata = { title: "Utkast och sidor" };

const statusLabels: Record<PageRow["status"], string> = {
  draft: "Utkast",
  published: "Publicerad",
  withdrawn: "Nedtagen",
  failed: "Misslyckades",
  retry: "Skrivs om",
};

const buttonLabels = { publish: "Publicera", withdraw: "Ta ned", retry: "Skriv om utkastet" } as const;

function Page({ page }: { page: PageRow }) {
  const title = page.data?.title ?? page.slug;
  return (
    <li className={styles.topic}>
      <div className={styles.summary}>
        <span className={styles.label}>{title}</span>
        <span className={styles.meta}>
          <span className={page.status === "published" ? styles.hot : styles.tag}>{statusLabels[page.status]}</span>
        </span>
      </div>
      <p className={styles.pageMeta}>
        Uppdaterad {formatDayAndTime(page.updated_at)}. Kostade {Number(page.cost_sek).toFixed(2).replace(".", ",")} kr.
        {page.data && <> {page.data.counts}.</>}{" "}
        {page.data && <Link href={`/admin/utkast/visa?id=${page.id}`}>Förhandsvisa</Link>}
        {page.status === "published" && (
          <>
            {" "}
            · <Link href={`/amne/${page.slug}`}>Öppna på sajten</Link>
          </>
        )}
      </p>
      {page.problems.length > 0 && (
        <ul className={styles.problems} aria-label="Det kontrollerna hittade">
          {page.problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}
      <div className={styles.decisions}>
        {allowedDecisions(page).map((decision) => (
          <form key={decision} action={decidePage}>
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="decision" value={decision} />
            <button type="submit" className={decision === "publish" ? styles.primary : styles.secondary}>
              {buttonLabels[decision]}
              <span className="sr-only">: {title}</span>
            </button>
          </form>
        ))}
      </div>
    </li>
  );
}

async function Pages() {
  await connection();
  let pages: PageRow[];
  try {
    pages = await listPages();
  } catch (error) {
    return (
      <p className={styles.notice}>
        Kunde inte läsa utkasten: {(error as Error).message}. Har migrationen <code>20261124120000_topic_pages.sql</code> körts i Supabase?
      </p>
    );
  }
  const waiting = pages.filter((page) => page.status === "draft" || page.status === "failed" || page.status === "retry");
  const published = pages.filter((page) => page.status === "published");
  const withdrawn = pages.filter((page) => page.status === "withdrawn");
  const section = (title: string, list: PageRow[], empty: string) => (
    <>
      <h2>
        {title} ({list.length})
      </h2>
      {list.length === 0 ? (
        <p className={styles.empty}>{empty}</p>
      ) : (
        <ol className={styles.list}>
          {list.map((page) => (
            <Page key={page.id} page={page} />
          ))}
        </ol>
      )}
    </>
  );
  return (
    <>
      {!analysisEnabled() && (
        <p className={styles.notice}>Analysjobbet är avstängt. Det skriver utkast först när miljövariabeln ANALYSIS_ENABLED är true.</p>
      )}
      {section("Väntar på dig", waiting, "Inga utkast väntar.")}
      {section("Publicerade", published, "Inga sidor från analysjobbet är publicerade än.")}
      {section("Nedtagna", withdrawn, "Inga nedtagna sidor.")}
    </>
  );
}

export default function DraftsPage() {
  return (
    <article className={`container-wide ${styles.page}`}>
      <AdminNav current="utkast" />
      <h1>Utkast och sidor</h1>
      <p className={styles.lead}>
        Utkasten som analysjobbet har skrivit om godkända ämnen. Ett utkast kan bara publiceras när alla kontroller har gått igenom. Förhandsvisa innan du publicerar.
      </p>
      <Suspense fallback={<p className={styles.empty}>Hämtar …</p>}>
        <Pages />
      </Suspense>
    </article>
  );
}
