Vercel + Supabase Deployment Guide

Required Environment Variables (add these in Vercel project settings):

- NEXT_PUBLIC_SUPABASE_URL  — your Supabase project URL (starts with https://...)
- NEXT_PUBLIC_SUPABASE_ANON_KEY — your Supabase anon/public API key

Optional (server-side only):
- SUPABASE_SERVICE_ROLE_KEY — Supabase service_role key (DO NOT expose to client). Use only in server-side code or API routes.

Steps to deploy (push-to-deploy):

1. Run the SQL script in Supabase SQL Editor:
   - Open Supabase project -> SQL Editor -> New query
   - Paste `supabase/migrations/complete_supabase_schema.sql` and run it.

2. Add environment variables to Vercel:
   - Go to your Vercel project -> Settings -> Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the `Production` scope (and optionally `Preview`/`Development`).

3. Push your branch to GitHub and create a PR / merge to `main`. Vercel will automatically build and deploy.

Build check:
- The project expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to be present in Vercel. Without them, the app will still build but Supabase client will be a harmless stub and runtime operations will error.

Security notes:
- Never add `SUPABASE_SERVICE_ROLE_KEY` to client envs (only use in server-only envs/APIs).
- If you need admin-only operations (migrations, background jobs), run them using the service_role key on a secure backend.

If you want, I can also prepare a GitHub Action to run schema migrations automatically on merge to main (requires service role key configured as a secret).