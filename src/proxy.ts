import { NextResponse, type NextRequest } from "next/server";

/*
 * The admin pages (/admin) are only for Jonathan. The browser asks for a
 * password (HTTP Basic). The password is the environment variable
 * ADMIN_PASSWORD; any user name works. Without the variable the pages do
 * not exist at all.
 */

/** Compares two strings in time that does not depend on where they differ. */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

function passwordFrom(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const colon = decoded.indexOf(":");
    return colon === -1 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) return new NextResponse("Sidan finns inte.", { status: 404 });
  const given = passwordFrom(request.headers.get("authorization"));
  if (given !== null && same(given, password)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  return new NextResponse("Lösenord krävs.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Redaktionen", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
