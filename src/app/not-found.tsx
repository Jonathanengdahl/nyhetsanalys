import Link from "next/link";
import { getPublishedTopics, topicPath } from "@/lib/topics";
import styles from "./prose.module.css";

export default async function NotFound() {
  const topics = await getPublishedTopics();
  return (
    <div className={`container ${styles.prose}`}>
      <h1>Sidan finns inte</h1>
      <p className={styles.lead}>Adressen kan vara fel, eller så har sidan flyttats. Här är ämnena vi har analyserat just nu.</p>
      <ul>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link href={topicPath(topic.slug)}>{topic.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/">Till startsidan</Link>
      </p>
    </div>
  );
}
