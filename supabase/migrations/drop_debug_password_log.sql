-- Remove the debug_password_log table and any objects attached to it.
--
-- This table was used by a debug helper (lib/auth.ts: logPasswordForDebug,
-- already removed from the codebase) to store plaintext passwords on every
-- signup/login/password-change. It must not exist in any environment.
-- Historical rows in this table represent real user credentials and should
-- be treated as compromised (affected users should be asked to rotate
-- their passwords after this migration runs).
--
-- Safe to run multiple times: every statement is guarded with IF EXISTS.
-- Scope is limited to the single `debug_password_log` table in the public
-- schema. This migration does NOT touch auth.users or any other
-- application table (user_profiles, portfolio_*, etc.).

-- Drop any RLS policies defined on the table, whatever they were named.
DO $$
DECLARE
  pol RECORD;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'debug_password_log'
  ) THEN
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'debug_password_log'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.debug_password_log', pol.policyname);
    END LOOP;
  END IF;
END $$;

-- Drop the table itself. Postgres automatically drops any indexes,
-- triggers, and constraints owned by the table along with it; CASCADE
-- additionally removes any dependent objects (e.g. views) if they were
-- ever created on top of this table.
DROP TABLE IF EXISTS public.debug_password_log CASCADE;
