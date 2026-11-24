import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Topic } from "@/lib/topics/types";
import type { PageStatus } from "./decisions";

/** Topic pages from the analysis job, as Jonathan sees them in /admin/utkast. */

export interface PageRow {
  id: number;
  cluster_id: number;
  slug: string;
  status: PageStatus;
  data: Topic | null;
  problems: string[];
  cost_sek: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const columns = "id, cluster_id, slug, status, data, problems, cost_sek, created_at, updated_at, published_at";

export async function listPages(): Promise<PageRow[]> {
  const { data, error } = await getSupabaseAdmin().from("topic_pages").select(columns).order("updated_at", { ascending: false }).limit(100);
  if (error) throw new Error(`topic_pages: ${error.message}`);
  return (data ?? []) as PageRow[];
}

export async function getPage(id: number): Promise<PageRow | null> {
  const { data, error } = await getSupabaseAdmin().from("topic_pages").select(columns).eq("id", id).maybeSingle();
  if (error) throw new Error(`topic_pages: ${error.message}`);
  return (data as PageRow | null) ?? null;
}

