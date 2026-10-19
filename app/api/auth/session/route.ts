import { NextResponse } from 'next/server';
import { getAdminBySessionToken, readSessionCookie } from '@/lib/auth-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = readSessionCookie(request.headers.get('cookie'));
  const admin = token ? await getAdminBySessionToken(token) : null;

  if (!admin) {
    return NextResponse.json({ success: true, data: { authenticated: false } });
  }

  return NextResponse.json({
    success: true,
    data: { authenticated: true, email: admin.email },
  });
}
