import { site } from "@/config/site";
import styles from "./page.module.css";

// Placeholder until step 2 builds the real start page.
export default function HomePage() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <h1 id="hero-title" className={styles.title}>
          {site.shortDescription}
        </h1>
        <p className={styles.lead}>{site.description}</p>
        <p className={styles.note}>Sajten byggs just nu. Ämnessidorna kommer snart.</p>
      </div>
    </section>
  );
}
