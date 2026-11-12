import { timingSafeEqual } from "node:crypto";

/** Compares the Authorization header with `Bearer <secret>` in constant time. */
export function hasJobSecret(request: Request, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
