import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "avrangzebabdujalilov.com";

// Eski *.vercel.app manzilidan kirilsa, hozirgi domenga doimiy (308)
// yo'naltirish qilamiz - shu orqali Google asta-sekin yangi domenni
// indekslaydi va eski havolani almashtiradi.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host.endsWith(".vercel.app")) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
