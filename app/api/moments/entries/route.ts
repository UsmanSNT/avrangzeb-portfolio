import { NextResponse } from "next/server";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";
import { getMomentsRole } from "@/lib/moments-auth";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET - both owner and guest sessions can read the timeline.
export async function GET() {
  try {
    const role = await getMomentsRole();
    if (!role) {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 401 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { data, error } = await supabase
      .from("moments_entries")
      .select("entry_date, content, image_url")
      .order("entry_date", { ascending: true });

    if (error) {
      console.error("moments/entries GET error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/entries GET error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

// POST - owner only. Upserts the entry for a given date.
export async function POST(request: Request) {
  try {
    const role = await getMomentsRole();
    if (role !== "owner") {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const entryDate = typeof body?.date === "string" ? body.date : "";
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const imageUrl = typeof body?.image_url === "string" && body.image_url ? body.image_url : null;

    if (!DATE_RE.test(entryDate)) {
      return NextResponse.json({ success: false, error: "Sana noto'g'ri" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: "Matn kiriting" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { data, error } = await supabase
      .from("moments_entries")
      .upsert({ entry_date: entryDate, content, image_url: imageUrl }, { onConflict: "entry_date" })
      .select("entry_date, content, image_url")
      .single();

    if (error) {
      console.error("moments/entries POST error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/entries POST error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

// DELETE - owner only.
export async function DELETE(request: Request) {
  try {
    const role = await getMomentsRole();
    if (role !== "owner") {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const entryDate = searchParams.get("date") || "";

    if (!DATE_RE.test(entryDate)) {
      return NextResponse.json({ success: false, error: "Sana noto'g'ri" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { error } = await supabase.from("moments_entries").delete().eq("entry_date", entryDate);

    if (error) {
      console.error("moments/entries DELETE error:", error);
      return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/entries DELETE error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
