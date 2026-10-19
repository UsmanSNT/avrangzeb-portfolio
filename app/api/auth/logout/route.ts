import { NextResponse } from 'next/server';
import {
  buildExpiredSessionCookie,
  deleteSession,
  readSessionCookie,
} from '@/lib/auth-session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const token = readSessionCookie(request.headers.get('cookie'));
  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    buildExpiredSessionCookie(process.env.NODE_ENV === 'production')
  );
  return response;
}
