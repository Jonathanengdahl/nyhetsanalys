import { SignupForm } from "@/components/signup/SignupForm";
import { site } from "@/config/site";
import styles from "./page.module.css";

// Placeholder until step 2 builds the real start page.
export default function HomePage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="container">
          <h1 id="hero-title" className={styles.title}>
            {site.shortDescription}
          </h1>
          <p className={styles.lead}>{site.description}</p>
          <p className={styles.note}>Sajten byggs just nu. Ämnessidorna kommer snart.</p>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="beta-title">
        <h2 id="beta-title">Var med i betan</h2>
        <p className={styles.sectionLead}>
          Vi testar tjänsten med en mindre grupp läsare. Anmäl dig så hör vi av oss.
        </p>
        <SignupForm kind="beta" />
      </section>

      <section className={styles.newsletter} aria-labelledby="newsletter-title">
        <div className="container">
          <h2 id="newsletter-title">Veckans viktigaste, på fem minuter.</h2>
          <p className={styles.newsletterLead}>
            Varje söndag: fem ämnen, hur de beskrevs och vad som saknades.
          </p>
          <SignupForm kind="newsletter" tone="dark" />
        </div>
      </section>
    </>
  );
}
