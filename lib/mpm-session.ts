const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function toHex(value: ArrayBuffer): string {
  return [...new Uint8Array(value)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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

export function sameText(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function createSession(secret: string): Promise<string> {
  const expires = String(Date.now() + SESSION_DURATION_MS);
  return `${expires}.${await signature(secret, expires)}`;
}

export async function verifySession(token: string, secret: string): Promise<boolean> {
  const [expires, providedSignature, extra] = token.split(".");
  if (!expires || !providedSignature || extra || Number(expires) <= Date.now()) {
    return false;
  }
  return sameText(providedSignature, await signature(secret, expires));
}

export const sessionMaxAge = Math.floor(SESSION_DURATION_MS / 1000);
