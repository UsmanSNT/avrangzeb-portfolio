-- Singleton settings row for the "moments" feature (currently just the book
-- cover photo). Same access model as create_moments_tables.sql: RLS enabled
-- with zero policies granted to anon/authenticated, so only the service-role
-- key (used exclusively inside app/api/moments/** after the custom session
-- check passes) can read/write this table.
--
-- Safe to run multiple times (every statement is guarded with IF NOT EXISTS
-- / IF EXISTS as appropriate).

CREATE TABLE IF NOT EXISTS public.moments_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  cover_image_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT moments_settings_singleton CHECK (id = 1)
);

ALTER TABLE public.moments_settings ENABLE ROW LEVEL SECURITY;

-- Reuses the generic updated_at trigger function already created by
-- create_moments_tables.sql.
DROP TRIGGER IF EXISTS moments_settings_updated_at ON public.moments_settings;
CREATE TRIGGER moments_settings_updated_at
  BEFORE UPDATE ON public.moments_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.moments_entries_set_updated_at();
