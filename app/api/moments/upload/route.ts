import { NextResponse } from "next/server";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";
import { getMomentsRole } from "@/lib/moments-auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// POST - owner only. Separate from /api/upload because this feature has no
// Supabase Auth session to attach to (see lib/moments-auth.ts) - it's gated
// entirely by the moments session cookie, then uses the service-role key
// server-side.
export async function POST(request: Request) {
  try {
    const role = await getMomentsRole();
    if (role !== "owner") {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Fayl kerak" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { success: false, error: "Faqat JPG, PNG, WEBP yoki GIF rasmlar ruxsat etiladi" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Fayl hajmi 10MB dan oshmasligi kerak" },
        { status: 400 }
      );
    }

    const fileName = `moments/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    const { data, error } = await supabase.storage
      .from("portfolio-images")
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("moments/upload error:", error);
      return NextResponse.json({ success: false, error: "Yuklashda xatolik" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("moments/upload error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
