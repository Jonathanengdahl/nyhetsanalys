/*
 * The admin password check, shared by the proxy (which guards every /admin
 * request) and the admin server actions (which check again, so an action
 * can never run without the password even if the proxy matcher changes).
 */

export const MIN_ADMIN_PASSWORD_LENGTH = 12;

/** Compares two strings in time that does not depend on where they differ. */
export function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

export function passwordFrom(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const colon = decoded.indexOf(":");
    return colon === -1 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

/** The configured password, or null when admin is switched off (missing or too short). */
export function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length >= MIN_ADMIN_PASSWORD_LENGTH ? password : null;
}

/** True when the Authorization header carries the right password. */
export function isAdminRequest(authorization: string | null): boolean {
  const password = adminPassword();
  if (!password) return false;
  const given = passwordFrom(authorization);
  return given !== null && same(given, password);
}
