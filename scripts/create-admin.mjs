#!/usr/bin/env node
// Creates or updates the single admin account.
//
// Required environment variables:
//   DATABASE_URL    PostgreSQL connection string for the portfolio database
//   ADMIN_EMAIL     admin email (stored lower-cased)
//   ADMIN_PASSWORD  admin password (at least 12 characters)
//
// Re-running the script replaces the password of the existing admin.
// The password is never written to disk or logged.
//
// The hash format and parameters must match hashPassword() in lib/auth-session.ts.

import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import pg from 'pg';

const scrypt = promisify(scryptCallback);
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 12;

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return ['scrypt', SCRYPT_PARAMS.N, SCRYPT_PARAMS.r, SCRYPT_PARAMS.p, salt.toString('hex'), hash.toString('hex')].join('$');
}

async function main() {
  const databaseUrl = requireEnv('DATABASE_URL');
  const email = requireEnv('ADMIN_EMAIL').toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const passwordHash = await hashPassword(password);
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const result = await client.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT ((lower(email))) DO UPDATE
         SET password_hash = EXCLUDED.password_hash, updated_at = now()
       RETURNING id`,
      [email, passwordHash]
    );

    // Existing sessions were issued under the previous password, so end them all.
    await client.query('DELETE FROM admin_sessions WHERE user_id = $1', [result.rows[0].id]);
    console.log(`Admin account ready: ${email}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
