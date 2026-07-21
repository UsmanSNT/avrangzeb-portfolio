import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from "@/lib/supabase/server";

const AUTH_DATE_MAX_AGE_SECONDS = 24 * 60 * 60;

interface TelegramPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function verifyTelegramHash(payload: TelegramPayload, botToken: string): boolean {
  const { hash, ...rest } = payload;
  const dataCheckString = Object.entries(rest)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const computedBuffer = Buffer.from(computedHash, "hex");
  const providedBuffer = Buffer.from(hash, "hex");

  return (
    computedBuffer.length === providedBuffer.length &&
    timingSafeEqual(computedBuffer, providedBuffer)
  );
}

export async function POST(request: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { success: false, error: "Telegram bot sozlanmagan" },
        { status: 500 }
      );
    }

    const payload = (await request.json().catch(() => null)) as TelegramPayload | null;
    if (!payload || !payload.id || !payload.hash || !payload.auth_date) {
      return NextResponse.json({ success: false, error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    if (!verifyTelegramHash(payload, botToken)) {
      return NextResponse.json({ success: false, error: "Tekshiruv muvaffaqiyatsiz" }, { status: 401 });
    }

    const ageSeconds = Math.floor(Date.now() / 1000) - payload.auth_date;
    if (ageSeconds > AUTH_DATE_MAX_AGE_SECONDS || ageSeconds < 0) {
      return NextResponse.json({ success: false, error: "So'rov muddati o'tgan" }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseServerClient({ useServiceRole: true });
    const fullName = [payload.first_name, payload.last_name].filter(Boolean).join(" ");
    const email = `telegram_${payload.id}@telegram.local`;

    // generateLink with type "magiclink" finds-or-creates the auth user in one
    // step (unlike admin.createUser, which errors if the email already exists),
    // so a partial failure on a previous attempt can't strand this in a
    // "user exists but we don't know its id" state.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        data: {
          full_name: fullName,
          telegram_id: payload.id,
          telegram_username: payload.username,
          avatar_url: payload.photo_url,
        },
      },
    });

    if (linkError || !linkData?.user) {
      console.error("Telegram generateLink error:", linkError);
      return NextResponse.json(
        { success: false, error: "Kirish havolasi yaratilmadi" },
        { status: 500 }
      );
    }

    const userId = linkData.user.id;

    const { data: existingProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
        id: userId,
        email,
        full_name: fullName || null,
        avatar_url: payload.photo_url || null,
        role: "user",
        telegram_id: payload.id,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Telegram user_profiles insert error:", profileError);
      }
    }

    return NextResponse.json({
      success: true,
      email,
      token: linkData.properties.email_otp,
    });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) return NextResponse.json(missingEnvResponse, { status: 500 });
    console.error("Telegram auth error:", error);
    return NextResponse.json({ success: false, error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
