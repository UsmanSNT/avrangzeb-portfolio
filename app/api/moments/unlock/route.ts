import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { MOMENTS_COOKIE_NAME, checkOwnerPassword, createSessionToken } from "@/lib/moments-auth";

// Minimal in-memory brute-force throttle. Resets on cold start/redeploy,
// which is an acceptable tradeoff for a single-user personal feature with
// no other rate-limiting infra (Redis/KV) in this project.
const attempts = new Map<string, { count: number; firstAttemptAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

async function getClientKey(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const key = await getClientKey();
    const now = Date.now();
    const record = attempts.get(key);

    if (record && now - record.firstAttemptAt < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { success: false, error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password || !checkOwnerPassword(password)) {
      const next = record && now - record.firstAttemptAt < WINDOW_MS
        ? { count: record.count + 1, firstAttemptAt: record.firstAttemptAt }
        : { count: 1, firstAttemptAt: now };
      attempts.set(key, next);

      // Small constant delay regardless of outcome so failed attempts can't
      // be timed to distinguish "wrong password" from "rate limited".
      await new Promise((resolve) => setTimeout(resolve, 400));

      return NextResponse.json({ success: false, error: "Parol noto'g'ri" }, { status: 401 });
    }

    attempts.delete(key);

    const token = createSessionToken("owner");
    const cookieStore = await cookies();
    cookieStore.set(MOMENTS_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // Must cover both /moments (the page) and /api/moments/* (the API
      // routes) - those don't share a path prefix other than root, so a
      // scoped path here would silently stop the cookie being sent to one
      // or the other. Still fully httpOnly, so no client-side JS can read it.
      path: "/",
      maxAge: 60 * 60 * 24, // 24h, matches createSessionToken's owner expiry
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("moments/unlock error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
