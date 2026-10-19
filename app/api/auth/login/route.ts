import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  buildSessionCookie,
  createSession,
  verifyPassword,
} from '@/lib/auth-session';

export const runtime = 'nodejs';

const MAX_FAILED_ATTEMPTS = 5;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 1024;

// Well-formed scrypt hash (same parameters as hashPassword) that matches no password.
// Used to spend the same CPU time when the email does not exist.
const DUMMY_HASH =
  'scrypt$16384$8$1$00000000000000000000000000000000$' + '0'.repeat(128);

// Per-client failure counter. Single-instance deployment, so process memory is sufficient.
const failures = new Map<string, { count: number; firstAt: number }>();

function clientKey(request: Request, email: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return `${forwarded || 'local'}|${email}`;
}

function isRateLimited(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > FAILURE_WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.firstAt > FAILURE_WINDOW_MS) {
    failures.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

function invalidCredentialsResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Invalid email or password' },
    { status: 401 }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH ||
    password.length === 0 ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const key = clientKey(request, normalizedEmail);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { success: false, error: 'Too many failed attempts. Try again later.' },
      { status: 429 }
    );
  }

  const rows = await query<{ id: string; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM admin_users WHERE lower(email) = $1',
    [normalizedEmail]
  );
  const user = rows[0];

  // Always run a hash comparison so a missing account does not respond faster than a wrong password.
  const valid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, DUMMY_HASH).then(() => false);

  if (!user || !valid) {
    recordFailure(key);
    return invalidCredentialsResponse();
  }

  failures.delete(key);

  const token = await createSession(user.id);
  const response = NextResponse.json({ success: true, data: { email: user.email } });
  response.headers.set(
    'Set-Cookie',
    buildSessionCookie(token, process.env.NODE_ENV === 'production')
  );
  return response;
}
