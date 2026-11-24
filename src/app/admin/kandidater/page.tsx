import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { categoryLabels, sortConfig } from "@/config/sort";
import { formatDayAndTime } from "@/lib/format";
import { getCandidates, type Candidate } from "@/lib/sort/admin";
import { decide } from "./actions";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Kandidater" };

const { threshold } = sortConfig;

const buttons: Record<Candidate["status"], { decision: "approve" | "reject" | "reopen"; label: string; primary?: boolean }[]> = {
  hot: [
    { decision: "approve", label: "Godkänn", primary: true },
    { decision: "reject", label: "Avböj" },
  ],
  watching: [
    { decision: "approve", label: "Godkänn ändå" },
    { decision: "reject", label: "Avböj" },
  ],
  approved: [{ decision: "reopen", label: "Ångra godkännandet" }],
  rejected: [{ decision: "reopen", label: "Ångra" }],
};

/** Plain forms, so the buttons work without JavaScript. */
function Decisions({ topic }: { topic: Candidate }) {
  return (
    <div className={styles.decisions}>
      {buttons[topic.status].map((button) => (
        <form key={button.decision} action={decide}>
          <input type="hidden" name="id" value={topic.id} />
          <input type="hidden" name="decision" value={button.decision} />
          <button type="submit" className={button.primary ? styles.primary : styles.secondary}>
            {button.label}
            <span className="sr-only">: {topic.label}</span>
          </button>
        </form>
      ))}
    </div>
  );
}

function Topic({ topic, open }: { topic: Candidate; open?: boolean }) {
  const heat = topic.heat;
  return (
    <li className={styles.topic} data-status={topic.status}>
      <details open={open}>
        <summary className={styles.summary}>
          <span className={styles.label}>{topic.label}</span>
          <span className={styles.meta}>
            <span className={styles.tag}>{categoryLabels[topic.category]}</span>
            {topic.status === "hot" && <span className={styles.hot}>Över tröskeln</span>}
            {topic.status === "approved" && <span className={styles.tag}>Godkänd</span>}
            {topic.status === "rejected" && <span className={styles.tag}>Avböjd</span>}
          </span>
          <dl className={styles.numbers}>
            <div>
              <dt>Källor</dt>
              <dd>
                {heat.sources ?? 0}
                <span className={styles.of}>/{threshold.sources}</span>
              </dd>
            </div>
            <div>
              <dt>Mediehus</dt>
              <dd>
                {heat.houses ?? 0}
                <span className={styles.of}>/{threshold.houses}</span>
              </dd>
            </div>
            <div>
              <dt>Medier</dt>
              <dd>{heat.outlets ?? 0}</dd>
            </div>
            <div>
              <dt>Rikstäckande</dt>
              <dd>{heat.national ?? 0}</dd>
            </div>
            <div>
              <dt>Senaste 6 h</dt>
              <dd>{heat.fresh ?? 0}</dd>
            </div>
          </dl>
        </summary>
        <p className={styles.times}>
          {topic.first_article_at && <>Först sedd {formatDayAndTime(topic.first_article_at)}. </>}
          {topic.last_article_at && <>Senaste artikel {formatDayAndTime(topic.last_article_at)}. </>}
          {topic.hot_since && <>Över tröskeln sedan {formatDayAndTime(topic.hot_since)}.</>}
        </p>
        <ul className={styles.articles}>
          {topic.articles.slice(0, 12).map((article) => (
            <li key={article.id}>
              <span className={styles.source}>{article.sourceName}</span>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <time dateTime={article.published_at ?? article.fetched_at} className={styles.time}>
                {formatDayAndTime(article.published_at ?? article.fetched_at)}
              </time>
            </li>
          ))}
          {topic.articles.length > 12 && <li className={styles.more}>och {topic.articles.length - 12} till</li>}
        </ul>
      </details>
      <Decisions topic={topic} />
    </li>
  );
}

async function Overview() {
  await connection();
  let data: Awaited<ReturnType<typeof getCandidates>>;
  try {
    data = await getCandidates();
  } catch (error) {
    return (
      <p className={styles.notice}>
        Kunde inte läsa kandidaterna: {(error as Error).message}. Har migrationen <code>20261112120000_sorting.sql</code> körts i Supabase?
      </p>
    );
  }
  const run = data.lastRun;
  return (
    <>
      <dl className={styles.status}>
        <div>
          <dt>Senaste sortering</dt>
          <dd>{run ? `${formatDayAndTime(run.started_at)}${run.ok === false ? ", misslyckades" : ""}` : "Inte körd än"}</dd>
        </div>
        <div>
          <dt>Artiklar senaste dygnet</dt>
          <dd>{data.articlesLast24h}</dd>
        </div>
        <div>
          <dt>Väntar på sortering</dt>
          <dd>{data.unsorted}</dd>
        </div>
        <div>
          <dt>AI-kostnad i dag</dt>
          <dd>
            {data.spentTodaySek.toFixed(2).replace(".", ",")} kr av {sortConfig.dailyBudgetSek} kr
          </dd>
        </div>
      </dl>
      {run?.error && <p className={styles.notice}>Fel i senaste körningen: {run.error}</p>}

      <h2>Över tröskeln ({data.hot.length})</h2>
      <p className={styles.help}>
        Minst {threshold.sources} källor från {threshold.houses} mediehus inom {threshold.windowHours} timmar, varav ett rikstäckande. Samma TT-text räknas
        som en källa. Godkänn det som är allmänintresse och avböj resten, till exempel sport, nöje eller enskilda brott.
      </p>
      {data.hot.length === 0 ? (
        <p className={styles.empty}>Inga ämnen över tröskeln just nu.</p>
      ) : (
        <ol className={styles.list}>
          {data.hot.map((topic) => (
            <Topic key={topic.id} topic={topic} open />
          ))}
        </ol>
      )}

      <h2>Godkända ({data.approved.length})</h2>
      <p className={styles.help}>
        Godkända ämnen ska bli ämnessidor. Analysjobbet som skriver dem är inte byggt än, så i dag skriver Claude sidorna för hand utifrån den här listan.
      </p>
      {data.approved.length === 0 ? (
        <p className={styles.empty}>Inga godkända ämnen än.</p>
      ) : (
        <ol className={styles.list}>
          {data.approved.map((topic) => (
            <Topic key={topic.id} topic={topic} />
          ))}
        </ol>
      )}

      <h2>Bevakas ({data.watching.length})</h2>
      <p className={styles.help}>Ämnen under tröskeln, flest källor först. De visas inte för läsarna.</p>
      {data.watching.length === 0 ? (
        <p className={styles.empty}>Inga ämnen än.</p>
      ) : (
        <ol className={styles.list}>
          {data.watching.map((topic) => (
            <Topic key={topic.id} topic={topic} />
          ))}
        </ol>
      )}

      <h2>Avböjda ({data.rejected.length})</h2>
      <p className={styles.help}>Avböjda ämnen med artiklar de senaste dygnen. Sorteringen lägger nya artiklar här, men de visas aldrig för läsarna.</p>
      {data.rejected.length === 0 ? (
        <p className={styles.empty}>Inga avböjda ämnen.</p>
      ) : (
        <ol className={styles.list}>
          {data.rejected.map((topic) => (
            <Topic key={topic.id} topic={topic} />
          ))}
        </ol>
      )}
    </>
  );
}

export default function CandidatesPage() {
  return (
    <article className={`container-wide ${styles.page}`}>
      <h1>Kandidater</h1>
      <p className={styles.lead}>Det sorteringen har hittat i medierna. Bara du ser den här sidan.</p>
      <Suspense fallback={<p className={styles.empty}>Hämtar …</p>}>
        <Overview />
      </Suspense>
    </article>
  );
}
