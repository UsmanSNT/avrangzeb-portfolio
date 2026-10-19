-- Admin-only authentication for the self-hosted portfolio.
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS admin_users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        NOT NULL,
  password_hash text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Emails are compared case-insensitively; the app stores them lower-cased.
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_key ON admin_users (lower(email));

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text        PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON admin_sessions (user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);
