-- Private "moments" feature: a password-gated, non-linked page unrelated to
-- the rest of the site's Supabase-auth/user_profiles system. These two
-- tables are only ever touched server-side via the service-role key, gated
-- by a custom signed cookie (see lib/moments-auth.ts) - never by the
-- anon/authenticated Supabase roles used elsewhere in the app.
--
-- RLS is enabled with zero policies granted to anon/authenticated, which
-- means those roles get zero access (deny-by-default). Only the service
-- role (which bypasses RLS entirely) can read/write these tables, and that
-- key is only ever used inside app/api/moments/** route handlers after the
-- custom password/token check passes.
--
-- Safe to run multiple times (every statement is guarded with IF NOT EXISTS
-- / IF EXISTS as appropriate).

CREATE TABLE IF NOT EXISTS public.moments_entries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entry_date DATE NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.moments_entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.moments_access_tokens (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

ALTER TABLE public.moments_access_tokens ENABLE ROW LEVEL SECURITY;

-- Keep updated_at current on edit.
CREATE OR REPLACE FUNCTION public.moments_entries_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS moments_entries_updated_at ON public.moments_entries;
CREATE TRIGGER moments_entries_updated_at
  BEFORE UPDATE ON public.moments_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.moments_entries_set_updated_at();
