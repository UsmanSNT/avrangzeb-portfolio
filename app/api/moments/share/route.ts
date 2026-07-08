import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";
import { getMomentsRole } from "@/lib/moments-auth";

// POST - owner only. Creates a single-use share token, valid for 7 days
// unless redeemed sooner (redemption invalidates it immediately either way).
export async function POST() {
  try {
    const role = await getMomentsRole();
    if (role !== "owner") {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { error } = await supabase
      .from("moments_access_tokens")
      .insert({ token, expires_at: expiresAt });

    if (error) {
      console.error("moments/share error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, token });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/share error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
