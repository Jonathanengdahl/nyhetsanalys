"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin/auth";
import { decisionInput, statusAfter } from "@/lib/sort/decide";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Approve, reject or reopen a candidate topic. Only with the admin password. */
export async function decide(formData: FormData): Promise<void> {
  const requestHeaders = await headers();
  if (!isAdminRequest(requestHeaders.get("authorization"))) throw new Error("Lösenord krävs.");

  const input = decisionInput.safeParse({ id: formData.get("id"), decision: formData.get("decision") });
  if (!input.success) throw new Error("Ogiltigt beslut.");
  const { id, decision } = input.data;

  const db = getSupabaseAdmin();
  const current = await db.from("topic_clusters").select("status, heat, hot_since").eq("id", id).maybeSingle();
  if (current.error) throw new Error(`topic_clusters kunde inte läsas: ${current.error.message}`);
  if (!current.data) throw new Error("Ämnet finns inte.");

  const heatIsHot = Boolean((current.data.heat as { hot?: boolean } | null)?.hot);
  const status = statusAfter(decision, heatIsHot);
  const now = new Date().toISOString();
  const { error } = await db
    .from("topic_clusters")
    .update({
      status,
      updated_at: now,
      // An approved topic keeps the time it became hot; a reopened topic that is still hot gets one if it lacks it.
      hot_since: status === "hot" || status === "approved" ? (current.data.hot_since ?? now) : null,
    })
    .eq("id", id);
  if (error) throw new Error(`topic_clusters kunde inte sparas: ${error.message}`);

  revalidatePath("/admin/kandidater");
}
