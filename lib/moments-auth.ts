import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const MOMENTS_COOKIE_NAME = "moments_session";
const OWNER_SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30d - private single-owner page, long session avoids silent lockouts
const GUEST_SESSION_MS = 4 * 60 * 60 * 1000; // 4h

export type MomentsRole = "owner" | "guest";

interface SessionPayload {
  role: MomentsRole;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.MEMORIES_SESSION_SECRET;
  if (!secret) {
    throw new Error("MEMORIES_SESSION_SECRET is not configured");
  }
  return secret;
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Builds a signed, opaque session token. Not encrypted - only carries a role and expiry, nothing sensitive. */
export function createSessionToken(role: MomentsRole): string {
  const ms = role === "owner" ? OWNER_SESSION_MS : GUEST_SESSION_MS;
  const payload: SessionPayload = { role, exp: Date.now() + ms };
  const encoded = base64url(JSON.stringify(payload));
  const secret = getSecret();
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

/** Verifies a session token's signature and expiry. Returns the role if valid, otherwise null. */
export function verifySessionToken(token: string | undefined | null): MomentsRole | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expected = sign(encoded, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64url(encoded)) as SessionPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (payload.role !== "owner" && payload.role !== "guest") return null;
    return payload.role;
  } catch {
    return null;
  }
}

/** Reads and verifies the moments session cookie from the current request. */
export async function getMomentsRole(): Promise<MomentsRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MOMENTS_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Confirmed via a one-time diagnostic against production: the value stored
 * in Vercel came out one character longer than the real password, with the
 * first and last characters intact - i.e. a stray whitespace character
 * landed *inside* the string during copy/paste (likely from a soft-wrapped
 * display), not at the edges. A plain .trim() doesn't touch that. Password
 * values have no legitimate reason to contain whitespace, so stripping all
 * of it (not just the edges) from both sides is a safe, robust fix.
 */
function normalizePassword(value: string): string {
  return value.replace(/\s+/g, "");
}

/** Constant-time comparison of the submitted password against the configured one. */
export function checkOwnerPassword(candidate: string): boolean {
  const expected = process.env.MEMORIES_ACCESS_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(normalizePassword(candidate));
  const b = Buffer.from(normalizePassword(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
