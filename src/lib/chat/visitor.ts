import "server-only";
import { createHmac } from "node:crypto";

/** The visitor's IP address as Vercel passes it on. Never stored. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * A pseudonym for the visitor that changes every day: a keyed hash of the IP
 * address and the date. It cannot be turned back into the IP address without
 * the server secret, and it is only used to count questions per day.
 */
export function visitorId(ip: string, day: string): string {
  const secret = process.env.CHAT_SECRET || process.env.SUPABASE_SECRET_KEY || "local-development-only";
  return createHmac("sha256", secret).update(`${day}|${ip}`).digest("base64url").slice(0, 32);
}
