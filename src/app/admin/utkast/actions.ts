"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { isAdminRequest } from "@/lib/admin/auth";
import { allowedDecisions, pageDecision } from "@/lib/admin/decisions";
import { getPage } from "@/lib/admin/pages";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { TOPICS_TAG } from "@/lib/topics/remote";
import { topicProblems } from "@/lib/topics/validate";

/** Publish, take down or redo a draft. Only with the admin password. */
export async function decidePage(formData: FormData): Promise<void> {
  if (!isAdminRequest((await headers()).get("authorization"))) throw new Error("Lösenord krävs.");
  const input = pageDecision.safeParse({ id: formData.get("id"), decision: formData.get("decision") });
  if (!input.success) throw new Error("Ogiltigt beslut.");
  const { id, decision } = input.data;

  const page = await getPage(id);
  if (!page) throw new Error("Utkastet finns inte.");
  if (!allowedDecisions(page).includes(decision)) throw new Error("Det går inte att göra så med det här utkastet.");

  const now = new Date().toISOString();
  let values: Record<string, unknown>;
  if (decision === "publish") {
    // Checked again right before publishing, with the code as it is now.
    const problems = page.data ? topicProblems(page.data) : ["Utkastet är tomt."];
    if (problems.length) throw new Error(`Utkastet klarar inte kontrollerna: ${problems[0]}`);
    values = { status: "published", published_at: page.published_at ?? now, updated_at: now, data: { ...page.data, publishedAt: page.data?.publishedAt ?? now } };
  } else if (decision === "withdraw") {
    values = { status: "withdrawn", updated_at: now };
  } else {
    values = { status: "retry", updated_at: now };
  }

  const { error } = await getSupabaseAdmin().from("topic_pages").update(values).eq("id", id);
  if (error) throw new Error(`topic_pages kunde inte sparas: ${error.message}`);

  // Readers see a published or withdrawn page right away.
  if (decision !== "retry") updateTag(TOPICS_TAG);
  revalidatePath("/admin/utkast");
}
