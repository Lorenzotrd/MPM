import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSession, sameText, sessionMaxAge } from "../../../lib/mpm-session";

function accessRedirect(request: NextRequest, query: string) {
  return NextResponse.redirect(new URL(`/access${query}`, request.url), 303);
}

export async function POST(request: NextRequest) {
  const expectedUsername = process.env.MPM_USERNAME;
  const expectedCode = process.env.MPM_ACCESS_CODE;
  const sessionSecret = process.env.MPM_SESSION_SECRET;
  if (!expectedUsername || !expectedCode || !sessionSecret) {
    return accessRedirect(request, "?unavailable=1");
  }

  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const code = String(form.get("code") ?? "");
  const validUsername = sameText(username, expectedUsername.trim().toLowerCase());
  const validCode = sameText(code, expectedCode);
  if (!validUsername || !validCode) return accessRedirect(request, "?error=1");

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set("mpm_session", await createSession(sessionSecret), {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: sessionMaxAge,
  });
  return response;
}
