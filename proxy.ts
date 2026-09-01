import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "./lib/mpm-session";

export async function proxy(request: NextRequest) {
  // Sites/Cloudflare already protects the site in worker/index.ts.
  if (!process.env.VERCEL) return NextResponse.next();

  const secret = process.env.MPM_SESSION_SECRET;
  const session = request.cookies.get("mpm_session")?.value;
  if (secret && session && (await verifySession(session, secret))) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/access";
  accessUrl.search = "";
  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: [
    "/((?!access|api/access|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};
