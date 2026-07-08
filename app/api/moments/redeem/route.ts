import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";
import { MOMENTS_COOKIE_NAME, createSessionToken } from "@/lib/moments-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json({ success: false, error: "Havola topilmadi" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });

    const { data, error } = await supabase
      .from("moments_access_tokens")
      .select("id, expires_at, used_at")
      .eq("token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Havola yaroqsiz" }, { status: 404 });
    }

    if (data.used_at) {
      return NextResponse.json(
        { success: false, error: "Bu havola allaqachon ishlatilgan" },
        { status: 410 }
      );
    }

    if (new Date(data.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: "Havola muddati tugagan" }, { status: 410 });
    }

    // Mark used immediately so a second, near-simultaneous redemption attempt loses the race.
    const { error: updateError } = await supabase
      .from("moments_access_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", data.id)
      .is("used_at", null);

    if (updateError) {
      console.error("moments/redeem update error:", updateError);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    const sessionToken = createSessionToken("guest");
    const cookieStore = await cookies();
    cookieStore.set(MOMENTS_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // must cover /moments and /api/moments/* - see unlock/route.ts
      maxAge: 60 * 60 * 4, // 4h, matches createSessionToken's guest expiry
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) {
      return NextResponse.json(missingEnvResponse, { status: 500 });
    }
    console.error("moments/redeem error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
