import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { query } from '@/lib/db';

// Server-only. Single-role (admin) authentication backed by PostgreSQL.

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

export const SESSION_COOKIE_NAME = 'portfolio_admin_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminUser = { id: string; email: string };

/** Hashes a password as `scrypt$N$r$p$<saltHex>$<hashHex>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return [
    'scrypt',
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt.toString('hex'),
    hash.toString('hex'),
  ].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, saltHex, hashHex] = parts;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT_PARAMS.maxmem,
  });

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Creates a session row and returns the raw token. Only its SHA-256 hash is stored. */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');

  await query(
    `INSERT INTO admin_sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, now() + make_interval(secs => $3))`,
    [hashToken(token), userId, SESSION_TTL_SECONDS]
  );

  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await query('DELETE FROM admin_sessions WHERE token_hash = $1', [hashToken(token)]);
}

/** Returns the admin behind a raw session token, or null when missing or expired. */
export async function getAdminBySessionToken(token: string): Promise<AdminUser | null> {
  const rows = await query<{ id: string; email: string }>(
    `SELECT u.id, u.email
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)]
  );

  return rows[0] ?? null;
}

/** Reads the session cookie from a raw Cookie header value. */
export function readSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) continue;

    const name = part.slice(0, separatorIndex).trim();
    if (name === SESSION_COOKIE_NAME) {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim()) || null;
    }
  }

  return null;
}

export function buildSessionCookie(token: string, secure: boolean): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
}

export function buildExpiredSessionCookie(secure: boolean): string {
  const attributes = [`${SESSION_COOKIE_NAME}=`, 'Path=/', 'Max-Age=0', 'HttpOnly', 'SameSite=Lax'];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
}
