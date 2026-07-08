import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MOMENTS_COOKIE_NAME } from "@/lib/moments-auth";

// POST - clears the session cookie, works for both owner and guest sessions.
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: MOMENTS_COOKIE_NAME, path: "/moments" });
  return NextResponse.json({ success: true });
}
