import { NextResponse } from "next/server";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";
import { getMomentsRole } from "@/lib/moments-auth";

// GET - both owner and guest sessions can see the cover photo.
export async function GET() {
  try {
    const role = await getMomentsRole();
    if (!role) {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 401 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { data, error } = await supabase
      .from("moments_settings")
      .select("cover_image_url")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("moments/cover GET error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: data?.cover_image_url || null });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/cover GET error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

// POST - owner only. Upserts the singleton cover-photo row.
export async function POST(request: Request) {
  try {
    const role = await getMomentsRole();
    if (role !== "owner") {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const imageUrl = typeof body?.image_url === "string" && body.image_url ? body.image_url : null;

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { error } = await supabase
      .from("moments_settings")
      .upsert({ id: 1, cover_image_url: imageUrl }, { onConflict: "id" });

    if (error) {
      console.error("moments/cover POST error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/cover POST error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
