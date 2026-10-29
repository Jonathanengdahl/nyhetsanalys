import type { Metadata } from "next";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { site } from "@/config/site";
import type { UncertaintyLabel } from "@/lib/topics/types";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Så arbetar vi",
  description:
    "Hur vi väljer ämnen, var vi hämtar materialet, hur varje artikel analyseras, hur vi märker osäkerhet och vad AI och människor gör.",
  alternates: { canonical: "/metod" },
};

const toc = [
  { href: "#amnen", label: "Vilka ämnen" },
  { href: "#kallor", label: "Källor" },
  { href: "#analysen", label: "Analysen" },
  { href: "#osakerhet", label: "Osäkerhet" },
  { href: "#ai-och-manniskor", label: "AI och människor" },
  { href: "#feedback", label: "Feedback och rättelser" },
  { href: "#agande", label: "Ägande" },
];

const labels: { label: UncertaintyLabel; text: string }[] = [
  { label: "Bekräftat", text: "Uppgiften stöds av flera oberoende källor eller av en primärkälla, till exempel en myndighet." },
  { label: "Siffror skiljer sig", text: "Källorna anger olika siffror. Vi visar alla och vem som står bakom varje." },
  { label: "Ändras över tid", text: "Uppgiften har ändrats i takt med att bilden klarnat, och vi visar hur." },
  { label: "Uppskattning", text: "En beräkning eller bedömning, inte ett exakt mått." },
  { label: "Omstritt", text: "Kunniga källor tolkar samma sak olika. Vi redovisar sidorna." },
  { label: "Obekräftat", text: "Uppgiften kommer från en enda källa och har inte kunnat kontrolleras." },
  { label: "Falskt", text: "Uppgiften har visat sig vara fel, och vi förklarar varför." },
];

export default function MethodPage() {
  return (
    <article className={`container ${styles.prose}`}>
      <h1>Så arbetar vi</h1>
      <p className={styles.lead}>
        Vi analyserar de mest omskrivna nyhetsämnena. Vi jämför hur olika medier beskriver samma händelse, artikel för
        artikel, och visar vad som saknas i debatten. Här står exakt hur det går till.
      </p>
      <nav aria-label="På den här sidan">
        <ul className={styles.toc}>
          {toc.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <h2 id="amnen">Vilka ämnen vi tar upp</h2>
      <p>Vi skriver bara om ämnen som många medier skriver om. Hellre färre ämnen med en ordentlig analys än många tunna.</p>
      <dl className={styles.facts}>
        <div>
          <dt>Många skriver om det</dt>
          <dd>Minst fem oberoende källor inom två dygn, från minst tre olika mediehus.</dd>
        </div>
        <div>
          <dt>Ett stort medium är med</dt>
          <dd>Minst ett rikstäckande medium bevakar ämnet.</dd>
        </div>
        <div>
          <dt>Allmänintresse</dt>
          <dd>Politik, ekonomi, samhälle eller utrikes. Vi skriver inte om privatpersoner.</dd>
        </div>
        <div>
          <dt>Ett tak</dt>
          <dd>Högst runt tio aktiva ämnen samtidigt, så att varje ämne får tid och omsorg.</dd>
        </div>
      </dl>
      <p>
        Varje ämne har en kärnfråga, till exempel ”Varför protesterar fransmännen och vad händer nu?”. Den avgör vad som
        hör hemma på sidan. Blir en tråd stor nog att stå på egna ben bryts den ut till ett eget ämne som länkas från
        huvudämnet. Ämnen som svalnar arkiveras och kan väckas igen.
      </p>

      <h2 id="kallor">Var vi hämtar materialet</h2>
      <dl className={styles.facts}>
        <div>
          <dt>Källistan</dt>
          <dd>
            Svenska nyhetsmedier: public service, rikstäckande och regionala tidningar samt TT. Hela listan publiceras
            när insamlingen startar.
          </dd>
        </div>
        <div>
          <dt>Landet där det händer</dt>
          <dd>Vi läser alltid medier i det land där händelsen sker.</dd>
        </div>
        <div>
          <dt>Bredare sökning</dt>
          <dd>
            När ett ämne är hett söker vi även hos myndigheter, forskare och domstolar. Skrivs det mycket om ämnet i flera
            länder visar vi hur de beskriver det.
          </dd>
        </div>
      </dl>
      <p>
        Vi sammanfattar och länkar till originalen. Vi återpublicerar aldrig artiklar. Samma TT-text i flera tidningar
        räknas som en källa, annars skulle en enskild vinkel se större ut än den är.
      </p>

      <h2 id="analysen">Så analyseras en artikel</h2>
      <p>Varje artikel bedöms för sig. Ett medium är inte vänster eller höger, men en enskild text kan ta ställning.</p>
      <dl className={styles.facts}>
        <div>
          <dt>Genre</dt>
          <dd>Nyhet, analys, reportage, ledare eller debatt. Det avgör hur texten ska läsas.</dd>
        </div>
        <div>
          <dt>Fakta</dt>
          <dd>Vilka uppgifter texten bygger på och om de stämmer med andra källor.</dd>
        </div>
        <div>
          <dt>Urval</dt>
          <dd>Vad texten tar med och vad den lämnar ute.</dd>
        </div>
        <div>
          <dt>Röster</dt>
          <dd>Vilka som får komma till tals, och vilka som saknas.</dd>
        </div>
        <div>
          <dt>Språk</dt>
          <dd>Värdeladdade ord och hur händelsen benämns, till exempel protest, upplopp eller kravall.</dd>
        </div>
        <div>
          <dt>Rubrik mot brödtext</dt>
          <dd>Om rubriken säger samma sak som texten.</dd>
        </div>
        <div>
          <dt>Siffror</dt>
          <dd>Om siffrorna har källa och sammanhang.</dd>
        </div>
        <div>
          <dt>Källkvalitet</dt>
          <dd>Om texten bygger på egna uppgifter, nyhetsbyråer eller andrahandskällor.</dd>
        </div>
      </dl>
      <h3>Politisk placering</h3>
      <p>
        Vi placerar bara texter som tar ställning, som ledare och debattartiklar, och alltid med en motivering. Vi
        använder två axlar från statsvetenskapen: ekonomisk vänster–höger och GAL–TAN, där GAL står för grön, alternativ
        och libertär och TAN för traditionell, auktoritär och nationalistisk. Nyhetsartiklar placeras inte, och vi sätter
        aldrig en etikett på ett helt medium.
      </p>

      <h2 id="osakerhet">Så markerar vi osäkerhet</h2>
      <p>Uppgifter ändras ofta de första dagarna. Varje uppgift får en märkning, så att du ser hur säker den är.</p>
      <ul className={styles.labels}>
        {labels.map((item) => (
          <li key={item.label}>
            <UncertaintyBadge label={item.label} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <h2 id="ai-och-manniskor">Vad AI gör och vad människor gör</h2>
      <div className={styles.split}>
        <div className={styles.splitCard}>
          <h3>AI, Claude från Anthropic</h3>
          <ul>
            <li>samlar in och sorterar artiklar</li>
            <li>grupperar dem i ämnen</li>
            <li>analyserar varje artikel och skriver utkast till ämnessidan</li>
            <li>svarar i chatten, bara utifrån källorna på sidan</li>
          </ul>
        </div>
        <div className={styles.splitCard}>
          <h3>Människa</h3>
          <ul>
            <li>godkänner nya ämnen innan de publiceras</li>
            <li>granskar analyserna löpande</li>
            <li>beslutar om rättelser</li>
            <li>ansvarar för innehållet</li>
          </ul>
        </div>
      </div>
      <p>
        Allt som AI har skrivit är märkt. Arketyperna i perspektivpanelen är fiktiva och skrivna av AI. De visar hur olika
        hållningar läser samma fakta och representerar inga verkliga personer eller partier.
      </p>
      <p className={styles.draft}>
        Under betan visar vi exempel från 24 oktober. De är skrivna och faktakontrollerade med hjälp av AI, men de har
        inte granskats av en redaktör.
      </p>

      <h2 id="feedback">Feedback och rättelser</h2>
      <p>Du som läser hjälper oss att bli bättre. Så här tar vi emot och hanterar det du skickar in.</p>
      <ol>
        <li>
          <strong>Du säger till.</strong> På varje ämnessida kan du rapportera ett fel eller tipsa om ett perspektiv som
          saknas, gärna med källa. Under betan gör du det via e-post, senare även i chatten.
        </li>
        <li>
          <strong>AI:n sammanställer.</strong> Liknande synpunkter slås ihop och kontrolleras mot källorna. Varje dag får vi
          en sammanfattning.
        </li>
        <li>
          <strong>Vi granskar.</strong> En människa beslutar vad som ändras. Ingen ändring görs bara för att många skriver
          samma sak.
        </li>
        <li>
          <strong>Öppen rättelselogg.</strong> Rättelser och viktiga ändringar visas med datum på ämnessidan och samlat på
          sidan Rättelser.
        </li>
      </ol>

      <h2 id="agande">Ägande och oberoende</h2>
      <p>
        {site.name} ägs av {site.owner.name}. Tjänsten har inga politiska kopplingar. Ingen som betalar, varken läsare,
        företag eller annonsörer, kan påverka vad som står på ämnessidorna.
      </p>
      <dl className={styles.facts}>
        <div>
          <dt>{site.responsiblePublisher.title}</dt>
          <dd>{site.responsiblePublisher.name}</dd>
        </div>
        <div>
          <dt>Kontakt och rättelser</dt>
          <dd>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
