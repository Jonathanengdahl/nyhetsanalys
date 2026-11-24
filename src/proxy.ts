import { NextResponse, type NextRequest } from "next/server";
import { adminPassword, isAdminRequest } from "@/lib/admin/auth";

/*
 * The admin pages (/admin) are only for Jonathan. The browser asks for a
 * password (HTTP Basic). The password is the environment variable
 * ADMIN_PASSWORD; any user name works. Without the variable the pages do
 * not exist at all.
 */

export function proxy(request: NextRequest) {
  if (!adminPassword()) return new NextResponse("Sidan finns inte.", { status: 404 });
  if (isAdminRequest(request.headers.get("authorization"))) {
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
