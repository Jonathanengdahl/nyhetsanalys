import { timingSafeEqual } from "node:crypto";
import { feeds } from "@/content/feeds";
import { collect } from "@/lib/collect/run";
import { finishRun, startRun, supabaseCollectStore } from "@/lib/collect/store";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/*
 * Collects new articles from the feeds. Called every 15 minutes by Supabase
 * Cron with the secret CRON_SECRET (see README). Nobody else can start it.
 */

export const maxDuration = 60;

const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Compares the Authorization header with the secret in constant time. */
function authorized(request: Request, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json(503, { ok: false, message: "Insamlingen är inte påslagen: CRON_SECRET saknas." });
  if (!authorized(request, secret)) return json(401, { ok: false, message: "Ingen behörighet." });

  let db: ReturnType<typeof getSupabaseAdmin>;
  try {
    db = getSupabaseAdmin();
  } catch {
    return json(503, { ok: false, message: "Insamlingen är inte påslagen: Supabase saknas." });
  }
  const runId = await startRun(db, "collect");
  try {
    const stats = await collect({
      // Always a fresh response from the outlets, never a cached one.
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      store: supabaseCollectStore(db),
      feeds,
    });
    await finishRun(db, runId, { stats });
    return json(200, { ok: true, stats });
  } catch (error) {
    const message = (error as Error).message.slice(0, 500);
    console.error(`collect: ${message}`);
    await finishRun(db, runId, { error: message });
    return json(500, { ok: false, message: "Insamlingen misslyckades. Se job_runs." });
  }
}
