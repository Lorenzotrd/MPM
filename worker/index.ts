/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MPM_USERNAME?: string;
  MPM_ACCESS_CODE?: string;
  MPM_SESSION_SECRET?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const SESSION_COOKIE = "mpm_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function redirect(request: Request, path: string, cookie?: string): Response {
  const headers = new Headers({
    Location: new URL(path, request.url).toString(),
    "Cache-Control": "no-store",
  });
  if (cookie) headers.set("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

function cookieValue(request: Request, name: string): string | null {
  const cookies = request.headers.get("Cookie");
  if (!cookies) return null;
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=") || null;
  }
  return null;
}

function toHex(value: ArrayBuffer): string {
  return [...new Uint8Array(value)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signature(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function sameText(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function createSession(secret: string): Promise<string> {
  const expires = String(Date.now() + SESSION_DURATION_MS);
  return `${expires}.${await signature(secret, expires)}`;
}

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  if (!env.MPM_SESSION_SECRET) return false;
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return false;
  const [expires, providedSignature, extra] = token.split(".");
  if (!expires || !providedSignature || extra || Number(expires) <= Date.now()) return false;
  const expectedSignature = await signature(env.MPM_SESSION_SECRET, expires);
  return sameText(providedSignature, expectedSignature);
}

function sessionCookie(request: Request, value: string, maxAge: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function accessPage(hasError: boolean, unavailable = false): Response {
  const error = hasError
    ? '<p class="error" role="alert">Identifiant ou code incorrect. Vérifiez puis réessayez.</p>'
    : "";
  const form = unavailable
    ? '<p class="error" role="alert">Cet accès est momentanément indisponible.</p>'
    : `
      <form method="post" action="/access">
        <label for="username">Nom d'utilisateur</label>
        <input id="username" name="username" type="text" autocomplete="username" placeholder="menuisier" required autofocus>
        <label for="code">Code d'accès</label>
        <input id="code" name="code" type="password" autocomplete="current-password" inputmode="text" placeholder="Votre code privé" required>
        ${error}
        <button type="submit">Accéder au site <span>↗</span></button>
      </form>`;

  return new Response(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="color-scheme" content="dark">
  <title>Accès privé · Métal Portail & Menuiserie</title>
  <style>
    :root{--ink:#11110f;--paper:#f4f0e8;--copper:#b97a3d;--light:#fffdf8}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:var(--ink);color:var(--light);font-family:Manrope,"Avenir Next",Helvetica,Arial,sans-serif;display:grid;place-items:center;overflow:hidden}
    body:before,body:after{content:"";position:fixed;border:1px solid rgba(185,122,61,.18);border-radius:50%;pointer-events:none}
    body:before{width:620px;height:620px;left:-330px;top:-230px}
    body:after{width:820px;height:820px;right:-570px;bottom:-540px}
    main{width:min(980px,calc(100% - 34px));display:grid;grid-template-columns:.9fr 1.1fr;box-shadow:0 40px 120px rgba(0,0,0,.38);position:relative;z-index:1}
    .intro{padding:58px 50px;background:linear-gradient(145deg,#1c1b18,var(--ink));border:1px solid rgba(255,255,255,.1);display:flex;flex-direction:column;justify-content:space-between}
    .brand{display:flex;align-items:center}
    .mark{font-family:Georgia,serif;font-size:48px;letter-spacing:-.12em}.mark b{color:#d7a46c;font-weight:400}
    .line{width:1px;height:44px;background:var(--copper);margin:0 18px 0 22px}
    .name{font-size:10px;line-height:1.5;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
    .intro h1{font-family:Georgia,serif;font-size:54px;line-height:.95;font-weight:400;letter-spacing:-.045em;margin:80px 0 22px}
    .intro h1 em{color:#d7a46c;font-weight:400}
    .intro p{margin:0;color:rgba(255,255,255,.55);font-size:13px;line-height:1.7}
    .panel{padding:64px 58px;background:var(--paper);color:var(--ink)}
    .eyebrow{margin:0 0 18px;color:var(--copper);font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
    h2{margin:0 0 12px;font-family:Georgia,serif;font-size:38px;font-weight:400;letter-spacing:-.035em}
    .helper{margin:0 0 38px;color:#777167;font-size:13px;line-height:1.65}
    form{display:flex;flex-direction:column}
    label{margin:0 0 8px;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
    input{width:100%;height:52px;margin:0 0 24px;padding:0 15px;border:1px solid rgba(17,17,15,.18);border-radius:0;background:#fbf9f4;color:var(--ink);font:inherit;font-size:14px;outline:none}
    input:focus{border-color:var(--copper);box-shadow:0 0 0 2px rgba(185,122,61,.12)}
    button{height:54px;margin-top:4px;padding:0 22px;border:0;background:var(--copper);color:#fff;font:inherit;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:space-between;cursor:pointer}
    button:hover{background:#a5662f}button span{font-size:18px;font-weight:400}
    .error{margin:-8px 0 18px;padding:11px 13px;border-left:2px solid #a94b3d;background:rgba(169,75,61,.1);color:#7f3025;font-size:11px;line-height:1.5}
    .secure{margin:28px 0 0;color:#918a7f;font-size:9px;line-height:1.5;text-transform:uppercase;letter-spacing:.08em}
    @media(max-width:720px){main{grid-template-columns:1fr}.intro{padding:32px 26px}.intro h1{margin:48px 0 16px;font-size:42px}.panel{padding:42px 26px}.mark{font-size:38px}.line{height:36px;margin:0 14px}.name{font-size:8px}}
  </style>
</head>
<body>
  <main>
    <section class="intro">
      <div class="brand"><span class="mark">M<b>P</b>M</span><span class="line"></span><span class="name">Métal Portail<br>&amp; Menuiserie</span></div>
      <div><h1>Espace<br><em>protégé.</em></h1><p>Conception et aménagement<br>sur mesure dans les Landes.</p></div>
    </section>
    <section class="panel">
      <p class="eyebrow">Accès professionnel</p>
      <h2>Bienvenue.</h2>
      <p class="helper">Saisissez votre identifiant et votre code MPM pour continuer.</p>
      ${form}
      <p class="secure">Session sécurisée pendant 12 heures · Connexion chiffrée</p>
    </section>
  </main>
</body>
</html>`, {
    status: unavailable ? 503 : 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
    },
  });
}

async function handleAccess(request: Request, env: Env): Promise<Response> {
  if (!env.MPM_USERNAME || !env.MPM_ACCESS_CODE || !env.MPM_SESSION_SECRET) {
    return accessPage(false, true);
  }

  if (request.method === "GET") {
    if (await isAuthenticated(request, env)) return redirect(request, "/");
    return accessPage(new URL(request.url).searchParams.has("error"));
  }

  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const code = String(form.get("code") ?? "");
  const validUsername = sameText(username, env.MPM_USERNAME.trim().toLowerCase());
  const validCode = sameText(code, env.MPM_ACCESS_CODE);
  if (!validUsername || !validCode) return redirect(request, "/access?error=1");

  const session = await createSession(env.MPM_SESSION_SECRET);
  return redirect(
    request,
    "/",
    sessionCookie(request, session, Math.floor(SESSION_DURATION_MS / 1000)),
  );
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/access") return handleAccess(request, env);
    if (url.pathname === "/logout") {
      return redirect(request, "/access", sessionCookie(request, "", 0));
    }
    if (!(await isAuthenticated(request, env))) return redirect(request, "/access");

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
