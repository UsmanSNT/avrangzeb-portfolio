# PROJECT_MEMORY.md

> Permanent AI handoff document for this repository. Read this file fully before making any change.
> Written 2026-07-02. If significant time has passed since that date, re-verify claims against the
> actual repo/live site rather than trusting this document blindly — it is a snapshot, not a live feed.
> Audience: Claude, Codex, ChatGPT, Copilot, or any future human/AI developer picking this project up cold.

---

# Project Identity

- **Project name:** Avrangzeb Portfolio (`package.json` name: `vibe-coding`)
- **Live URL:** https://avrangzebabdujalilov.com/ (custom domain, connected 2026-07-07; the original https://avrangzeb-portfolio.vercel.app/ still resolves to the same deployment)
- **Repo root:** `c:\Users\avran\OneDrive\Ishchi stol\avrangzeb-portfolio`
- **Owner:** Abdujalilov Avrangzeb (GitHub: `UsmanSNT`)
- **Current on-site positioning (as shipped):** "Software Engineer & AI/Backend Developer" — Woosuk University, Jeonju, South Korea. (Updated 2026-07-07 across Hero copy, browser title, OG/Twitter cards, and JSON-LD; previously shipped as "Network Administrator & Cybersecurity Student".)
- **Target positioning:** Software Engineer / AI Engineer / Backend Engineer / Cybersecurity Engineer / Network Engineer — largely reflected in metadata/Hero now; still needs backing project content (see Known Problems: only 2 shallow showcase projects).
- **Business goal:** Convert this from a personal student portfolio into a premium, Upwork-ready and recruiter-ready professional portfolio that demonstrates engineering quality, not just lists projects. Primary audiences: Upwork clients, recruiters, international companies, startup founders, technical interviewers.

---

# Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.0.10 (App Router, Turbopack) |
| Runtime | Node.js, deployed on Vercel |
| Language | TypeScript 5.9.3 |
| UI library | React 19.2.0 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), custom CSS variables in `app/globals.css` |
| Database | Supabase Postgres |
| Auth | Supabase Auth (`@supabase/supabase-js` ^2.86.0, `@supabase/ssr` ^0.8.0) |
| Storage | Supabase Storage (buckets: `portfolio-images`, `portfolio-files`) |
| Animation | Framer Motion ^12.42.2 |
| Rich text | `quill` / `react-quill` (legacy package, React-18-era types — see Known Problems) |
| Lint | ESLint 9 + `eslint-config-next` |
| Deployment | Vercel |
| Testing / CI | **None exists.** No test runner, no CI pipeline, no error monitoring (Sentry etc.) |

---

# Current Architecture

## Folder structure (as of this snapshot)

```
app/
  admin/page.tsx              – super-admin dashboard (users, content moderation)
  api/                        – 12 route.ts handlers, see below
  auth/                       – login/register/forgot-password/reset-password/change-password (5 separate pages, no shared layout)
  books/page.tsx              – book-quotes feature (public view + admin CRUD)
  components/                 – Logo.tsx, ProjectCard.tsx, ErrorBoundary.tsx, RichTextEditor.tsx(+.d.ts)
  dashboard/page.tsx          – authenticated user profile page
  gallery/page.tsx            – certificates/events photo gallery (public view + admin CRUD)
  knowledge-hub/page.tsx      – networking study notes, prototype quality, own inline CSS-in-JS
  notes/page.tsx              – learning notes CRUD w/ rich text editor
  projects/[slug]/            – dynamic project case-study pages (page.tsx = server component, ProjectDetailClient.tsx = client)
  layout.tsx                  – root layout, metadata, JSON-LD Person schema
  page.tsx                    – **4,100+ lines**, entire homepage + all admin CRUD modals, "use client"
  globals.css                 – Tailwind v4 + design tokens, clean and well-organized
  robots.ts, sitemap.ts       – SEO route handlers
content/
  locales/                    – en.ts, ko.ts, ru.ts, uz.ts (304 lines each), index.ts (getHomeDictionary)
  shared/projects.ts          – shared project metadata (id, slug, image, links, color) via showcaseProjectMeta
lib/
  auth.ts                     – signUp/signIn/signOut/getUserProfile/isAdmin/isSuperAdmin/updateProfile/getAllUsers/updateUserRole
  api-auth.ts                 – NEW (this session's predecessor): shared requireUser()/requireAdmin() helpers for API routes
  supabase.ts                 – browser Supabase client (anon key), with graceful fallback stubs if env vars missing
  supabase/server.ts          – server Supabase client factory (anon or service-role key via useServiceRole flag)
  upload.ts                   – client-side image compression/upload/delete helpers
  database.types.ts           – hand-written, NOT generated from Supabase — stale vs. actual schema
  i18n/config.ts, i18n/types.ts – locale list, storage key, HomeDictionary type
supabase/migrations/          – raw SQL files, applied manually via Supabase SQL editor, no migration tool/versioning
public/                       – images, CV PDFs, manifest.json
Root docs: AGENTS.md, DEPLOYMENT.md, SUPABASE_API_DOCS.md, MIGRATION_INSTRUCTIONS.md, PROJECT_MEMORY.md (this file)
```

Orphaned file: `network_engineer_knowledge_hub.html` at repo root — static HTML, zero references anywhere in the codebase, superseded by `/knowledge-hub`. Safe to remove whenever someone touches that area.

## Important files

- `app/page.tsx` — the single most important file to understand and eventually break apart. Contains hero, about, skills, projects, books, gallery, CV, IT news, contact form, AND every admin CRUD modal for those features, all in one client component.
- `AGENTS.md` — the project's own stated mission/identity/design philosophy/workflow rules. Treat as authoritative for tone and quality bar, but note the live site has not yet caught up to what it describes (see Project Identity above).
- `content/locales/*.ts` + `content/shared/projects.ts` — the i18n and project-content system. High quality where used, but not used everywhere (see Known Problems).
- `lib/api-auth.ts` — newly introduced shared auth helper for API routes (`requireUser`, `requireAdmin`). Prefer this over re-inventing token-extraction logic in any new/edited API route.

## Current routing

Public pages: `/`, `/projects/[slug]` (SSG via `generateStaticParams`), `/books`, `/gallery`, `/notes`, `/knowledge-hub`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`.
Protected pages (client-side guard only, see Security Status): `/dashboard`, `/auth/change-password`, `/admin`.
No `middleware.ts` exists anywhere in the repo — there is no server-level route protection. Every "protected" page checks `supabase.auth.getUser()` in a `useEffect` and redirects; the page can flash before redirecting.
No locale-based URL routing (no `/en`, `/ko`, `/ru` paths) — language is a client-side `localStorage` preference only.

## API routes (`app/api/**/route.ts`)

| Route | Methods | Auth model (as of this snapshot) |
|---|---|---|
| `/api/admin/users` | GET, PUT, DELETE | **Secured this session-chain**: `requireAdmin`. Note: has zero frontend caller — confirmed dead from the UI's perspective, but was previously a live unauthenticated attack surface. |
| `/api/upload` | POST, DELETE | **Secured**: `requireUser` (any authenticated user, not admin-only — see Security Status for why). Image-type allowlist + 10MB cap on POST. |
| `/api/contacts` | GET, POST, PUT, DELETE | GET now admin-only (secured); POST public (intentional, it's the contact form); PUT/DELETE already admin-gated. |
| `/api/it-news` | GET, POST, PUT, DELETE | GET public; POST requires auth; PUT/DELETE now require owner-or-admin (previously any logged-in user could edit/delete anyone's post — fixed). View-increment path (`incrementViews`) still requires only basic auth, not ownership — left as-is, low severity. |
| `/api/book-quotes` | GET, POST, PUT, DELETE | Already correctly owner/admin-gated on write paths. |
| `/api/gallery` | GET, POST, PUT, DELETE | Already correctly owner/admin-gated (good reference pattern for `existingItem.user_id === null` → admin-only edge case). |
| `/api/gallery/add-certificates` | POST | Already admin-gated. |
| `/api/notes` | GET, POST, PUT, DELETE | Already correctly owner/admin-gated. |
| `/api/cv` | GET, POST, DELETE | GET public; POST/DELETE already admin-gated. |
| `/api/auth/profile` | GET, PUT | GET public (returns name/avatar only); PUT requires owner or super_admin. |
| `/api/auth/confirm-email` | POST | Uses service-role key correctly server-side, but accepts any `userId`/`email` pair with no caller verification — **known remaining risk, not fixed** (see Known Problems / Security Status). Tied to the signup auto-confirm flow; fixing it needs care to not break signup. |
| `/api/portfolio` | GET, OPTIONS | Public, read-only, no auth needed. |

Several routes still duplicate their own copy of the "extract bearer token / build authenticated client" logic instead of using `lib/api-auth.ts` — that consolidation has not been done yet (would touch many files; deferred as a deliberate scope decision, not an oversight).

## i18n system

Hand-rolled dictionary system, not a library (no `next-intl` etc.). `getHomeDictionary(locale)` in `content/locales/index.ts`, falls back to `uz`. All 4 locale files (`en`, `ko`, `ru`, `uz`) are structurally identical (`satisfies HomeDictionary`) and the translations are genuinely native-quality, not machine-copied. Only used by: home (`page.tsx`), `/books`, `/gallery`, `/notes`, `/projects/[slug]`. **Not used** by `/admin`, `/dashboard`, `/knowledge-hub`, or any of the 5 auth pages — those are hardcoded Uzbek regardless of selected language. `<html lang="uz">` in `app/layout.tsx` never updates when the user switches language, and the `alternates.languages` hreflang block declares 3 language variants that all resolve to the same URL (SEO no-op bug, not yet fixed).

## Supabase usage

- Browser client (`lib/supabase.ts`) uses the anon key, correctly.
- Server client (`lib/supabase/server.ts`) can mint anon or service-role clients via `useServiceRole` flag; service-role key usage is correctly server-only (confirmed via `SUPABASE_SERVICE_ROLE_KEY`, never exposed with `NEXT_PUBLIC_` prefix).
- 6 tracked SQL migration files under `supabase/migrations/`, applied manually via the Supabase SQL Editor — no migration tool/CLI versioning, no `supabase db push` workflow evidenced.
- One historical migration, `fix_notes_rls_policy.sql`, is explicitly a patch for previously-broken RLS policies — a signal that RLS has been misconfigured before and should not be assumed correct without checking.
- `lib/database.types.ts` is hand-written and stale vs. the real schema (missing types for tables that migrations clearly created — `portfolio_notes_rows`, `portfolio_it_news`, `user_profiles`, reaction tables, calendar/roadmap/micro-notes tables). Should eventually be regenerated via `supabase gen types typescript`.

---

# Security Status

## Completed security fixes (this session-chain, verified via direct source read + lint/typecheck/build)

1. **Removed plaintext password logging.** Three separate write sites removed:
   - `lib/auth.ts` — `logPasswordForDebug()` function and its calls in `signUp()`/`signIn()` deleted entirely.
   - `app/auth/reset-password/page.tsx` — removed the `debug_password_log` insert after password reset.
   - `app/auth/change-password/page.tsx` — removed the `debug_password_log` insert after password change.
   - Confirmed via repo-wide grep: zero remaining references to `debug_password_log`, `password_log`, `logPasswordForDebug`, or `password_plain` anywhere in application code.

2. **Secured `/api/admin/users`.** Previously had zero authentication on GET/PUT/DELETE (anyone could list all users, promote/demote roles, or delete any account). Now requires `requireAdmin` from `lib/api-auth.ts` → 401 if not logged in, 403 if not admin/super_admin. Confirmed via grep that this route has **no frontend caller at all** (the admin page talks to Supabase directly with the browser client), so this fix carries zero UI regression risk — it closes a pure, previously-live attack surface.

3. **Secured `/api/upload`.** Previously had zero authentication on POST/DELETE (anyone could upload or delete arbitrary files in Supabase Storage). Now requires `requireUser` — **any authenticated user, not admin-only**. This was a deliberate scope decision (see below), not an oversight. Also added: image MIME-type allowlist (jpeg/png/webp/gif) and a 10MB size cap on upload.
   - **Why "any authenticated user" and not admin-only:** `/api/upload` is shared by admin content-management flows (book quotes, gallery, IT news, CV — all in `app/page.tsx`) AND by `app/dashboard/page.tsx`'s avatar upload, which is used by regular non-admin logged-in users. Restricting to admin-only would have broken avatar upload for ordinary users. This trade-off was surfaced to and confirmed by the project owner before implementing.
   - Because the server now requires auth, 6 client call sites that previously sent no Authorization header at all had to be updated to attach `Authorization: Bearer <session token>`: 4 sites in `app/page.tsx` (migration helper, book quotes, gallery, IT news), 1 in `app/books/page.tsx`, 1 in `app/gallery/page.tsx`, 1 in `app/dashboard/page.tsx`. Without this, the security fix would have silently broken every upload flow in the app.

4. **Secured `/api/contacts` GET.** Previously exposed all contact-form submissions (names, Telegram handles, private messages) to anyone with no auth. Now admin-only. Confirmed no frontend caller exists for this GET either — zero regression risk.

5. **Fixed `/api/it-news` PUT/DELETE authorization gap.** Previously any authenticated user (not just admin/owner) could edit or delete any news post. Now requires the caller to be the item's owner or an admin/super_admin, mirroring the existing correct pattern already used in `gallery/route.ts` and `notes/route.ts`.

6. **`debug_password_log` migration prepared but NOT applied.** `supabase/migrations/drop_debug_password_log.sql` was created (idempotent, `IF EXISTS`-guarded, scoped to exactly that one table, does not touch `auth.users` or any app table, drops any RLS policies on the table before dropping the table itself). **This SQL has not been run against the live database** — running database migrations requires explicit user approval per this project's working rules, and that approval has not yet been given/executed. Whoever picks this up next should check whether it's been applied; if not, it still needs to be run manually via the Supabase SQL Editor.

## Remaining risks (known, not yet fixed — do not assume these are handled)

- **Historical plaintext passwords may still be sitting in the `debug_password_log` table in the live Supabase database** until the prepared migration is actually executed. Any user who signed up, logged in, or changed/reset their password before the code fix should be considered to have a compromised password and should be asked to rotate it.
- `/api/auth/confirm-email` accepts any `userId`/`email` pair in its POST body with no verification that the caller owns that account — a potential account-confirmation abuse vector. Not fixed; flagged as needing deeper investigation of the signup flow before touching it.
- The `incrementViews` path on `/api/it-news` PUT still only requires basic auth (any logged-in user), not ownership — low-severity vote/view manipulation risk, left as-is.
- No rate limiting anywhere in the API layer (contact form, uploads, auth endpoints all vulnerable to spam/abuse at volume).
- No input sanitization/XSS hardening on user-submitted text fields (book quotes, notes, IT news content) beyond basic non-empty checks — stored content is not escaped before storage.
- Several API routes still duplicate ~80-line token-extraction blocks instead of using the new `lib/api-auth.ts` helper — not a security bug per se, but a consistency/maintainability gap that increases the chance of the *next* route being added without proper auth.
- **RLS policies have not been comprehensively re-audited.** We know at least one table (`portfolio_notes_rows`) needed a policy hotfix in the past (`fix_notes_rls_policy.sql`). No systematic verification has been done that RLS is correctly configured on every table as a defense-in-depth backstop behind the API-level auth checks.
- No `middleware.ts` — all page-level route protection is client-side only. The API layer is the real security boundary; this document should be re-checked against the actual API route files (not assumed) before treating any endpoint as safe.

---

# Known Problems

- **`app/page.tsx` is too large.** 4,100+ lines, single `"use client"` component containing the entire homepage (hero/about/skills/projects/books/gallery/CV/news/contact) plus every admin CRUD modal. Unmaintainable and untestable as-is. Not yet refactored — the security-fix sessions deliberately touched this file only at the minimum lines necessary (adding auth headers to upload calls) and explicitly did not restructure it, per direct instruction.
- **Admin UI is mixed into the public homepage bundle.** All CRUD modals (book quotes, gallery, CV, IT news) for admin editing live inside `app/page.tsx` alongside the public-facing content, rather than being isolated under `/admin`.
- **Incomplete i18n usage.** Only ~5 of ~14 pages use the shared dictionary system (see i18n system above); `/admin`, `/dashboard`, `/knowledge-hub`, and all 5 auth pages are Uzbek-hardcoded regardless of the user's language selection.
- **SEO issues**, not yet fixed:
  - `sitemap.ts` lists only 4 URLs (home, notes, login, register) — misses both project case-study pages and books/gallery/knowledge-hub.
  - `<html lang="uz">` in `app/layout.tsx` never updates on locale switch.
  - `alternates.languages` hreflang block declares `en-US`/`ko-KR`/`uz-UZ` variants that all point at the identical URL — currently a no-op/incorrect for SEO purposes since there's no URL-based locale routing.
  - Site metadata/title still says "Network Administrator & Cybersecurity Student," not aligned with the target positioning.
  - 16+ plain `<img>` tags across `page.tsx`, `books/page.tsx`, `gallery/page.tsx`, `dashboard/page.tsx` bypass `next/image` optimization (only 3 correct `next/image` usages exist, in `Logo.tsx`, `ProjectCard.tsx`, `ProjectDetailClient.tsx`).
  - Mojibake/corrupted CJK+emoji text still present throughout `app/page.tsx` (~16 locations, e.g. line 118, category-icon literals ~1633-1637, several section headings) — not yet fixed.
- **Stale database types.** `lib/database.types.ts` is hand-written and out of sync with the real Supabase schema (missing several tables that migrations created). Should be regenerated via `supabase gen types typescript`, not fixed yet.
- **Weak route protection.** No `middleware.ts`; all "protected" pages rely on a client-side `useEffect` auth check that can flash protected UI before redirecting. The real protection has to live in the API layer (partially improved this session-chain, but not comprehensively audited — see Security Status remaining risks).
- **Remaining Supabase/RLS audit needed.** RLS policies across all tables have not been systematically reviewed; only spot-fixes are confirmed (`fix_notes_rls_policy.sql` history, and the API-level fixes documented above). Treat RLS as unverified until an explicit audit is done.
- **`next.config.ts` disables TypeScript build-error checking** (`typescript.ignoreBuildErrors: true`), added to work around a `react-quill`/React 19 peer-dependency type conflict. `.npmrc` also sets `legacy-peer-deps=true` masking the same underlying issue. Should be fixed properly (resolve or replace the rich-text editor dependency) rather than left suppressed — real type errors could currently ship to production undetected.
- **Only 2 showcase projects exist** (`Bir Ilm`, `Uz Travel`), both plain HTML/CSS/JS — insufficient to demonstrate the AI/backend/cybersecurity skill claims in the target positioning.
- **No shared header/nav or auth-page layout.** Header/nav markup is independently duplicated across at least 6 files (`admin`, `books`, `gallery`, `dashboard`, `notes`, homepage). The 5 auth pages duplicate identical gradient-background styling and a repeated "password must be 6+ characters" validation check instead of sharing a layout/utility.
- **No tests, no CI pipeline, no error monitoring** anywhere in the project.

---

# Target Architecture V2

This is the intended end-state folder structure. Do not attempt to migrate to this in one pass — see Roadmap for phased execution.

```
app/                    – Next.js App Router routes only. Thin route files that compose
                          from features/ and sections/. No business logic or large JSX trees
                          living directly in page.tsx files.
components/              – Small, generic, reusable UI primitives with no feature-specific
                          knowledge (buttons, cards, modals, form inputs). Already partially
                          exists (Logo, ProjectCard, ErrorBoundary) — extend this pattern,
                          don't duplicate it.
features/                – Feature-scoped modules that bundle a feature's own components,
                          hooks, and logic together (e.g. features/book-quotes/,
                          features/gallery/, features/it-news/, features/cv/). Each admin
                          CRUD flow currently embedded in app/page.tsx belongs here, split
                          from its public-facing display component.
sections/                – Homepage-specific presentational sections (Hero, About, Skills,
                          Contact, etc.) extracted out of the current monolithic page.tsx.
                          Each section should be independently readable and, ideally,
                          independently testable.
lib/                     – Cross-cutting technical utilities with no UI/feature awareness:
                          Supabase clients (already here), auth helpers (already here via
                          api-auth.ts), formatting/validation utilities.
content/                 – Static/structured content: i18n dictionaries (already here),
                          shared project metadata (already here), and any future
                          case-study/testimonial content.
hooks/                   – Shared React hooks extracted from repeated patterns currently
                          inlined in page.tsx (e.g. a useAuthUser hook to replace the
                          checkAuth-in-useEffect pattern repeated across admin/dashboard/
                          auth pages; a useImageUpload hook to replace the 4+ duplicated
                          compress-then-upload blocks).
types/                   – Shared TypeScript types/interfaces not tied to a single feature
                          (currently scattered: BookQuote/GalleryItem/ITNews interfaces are
                          defined inline in page.tsx instead of here).
services/                – Thin API-client wrapper functions (fetch wrappers per resource:
                          bookQuotesService, galleryService, itNewsService, uploadService)
                          so page/feature components call a typed function instead of
                          hand-rolling fetch + JSON parsing + error handling inline, as they
                          do today throughout page.tsx.
providers/                – React context providers (auth/session context, language context)
                          to replace the current pattern of every page independently calling
                          supabase.auth.getUser() and managing its own language state.
admin/                    – All admin-only CRUD UI (currently mixed into app/page.tsx)
                          isolated here, gated behind proper auth, not shipped in the public
                          homepage's JS bundle.
api/                      – Already exists under app/api/. Continue consolidating auth logic
                          through lib/api-auth.ts as routes are touched; don't re-invent
                          token extraction per route going forward.
```

---

# Product Goal

The end product must be a premium, Upwork-ready portfolio that credibly presents the owner as a versatile engineer across five overlapping specializations: **Software Engineer, AI Engineer, Backend Engineer, Cybersecurity Engineer, and Network Engineer.** The site's job is to demonstrate engineering *quality*, not just list projects — every page should implicitly or explicitly answer: Who is this engineer? What can he build? Why should I trust him? How can I contact him? This is a repositioning effort as much as a technical one: the current live copy still brands the owner primarily as a "Network Administrator Student," which undersells the breadth this product goal requires.

---

# Design Direction

Visual and interaction quality should be benchmarked against: **Stripe, Linear, Vercel, Apple, Raycast.** Take inspiration from their spacing, typographic hierarchy, restraint, and polish — do not copy their layouts directly. The existing dark theme and design-token setup in `app/globals.css` (cyan/violet accents on a slate background) is a reasonable foundation and is already one of the cleaner parts of this codebase; extend it rather than replacing it wholesale unless a redesign is explicitly requested.

---

# Content Strategy

To serve the product goal above, the site needs, roughly in priority order:

- **A stronger hero** that leads with the target positioning (Software/AI/Backend/Security/Network engineer) instead of "Network Administrator Student," with a clear value proposition and primary CTA.
- **A services section** — what the owner can be hired to do, framed for a client audience, not just a skills list.
- **Real case studies**, not just project cards: problem → approach → decisions → outcome, for each major project (the existing `ShowcaseProject` data model in `content/shared/projects.ts` / locale files already has fields for `problem`, `solution`, `challenges`, `lessonsLearned` — they're just underused with only 2 shallow projects populated).
- **AI projects** demonstrating the "AI Engineer" claim — currently absent.
- **Backend projects** demonstrating the "Backend Engineer" claim — currently absent (both existing projects are plain HTML/CSS/JS).
- **Cybersecurity projects** demonstrating the "Cybersecurity Engineer" claim beyond listing certifications-in-progress.
- **Testimonials/social proof** — currently none.
- **GitHub proof** — live contribution activity, pinned repos, or similar credibility signals beyond a profile link.
- **Resume/CV** — already exists as a static PDF download; consider whether it should be tailored per target audience (Upwork client vs. recruiter) rather than one-size-fits-all.
- **A contact funnel** with clear next steps for a client vs. a recruiter — the current contact form is generic and undifferentiated.

---

# Development Rules

These apply to every future change in this repository, by any AI agent or human:

- **Never hardcode user-visible text.** Always route it through the existing i18n dictionary system (`content/locales/*.ts` + `getHomeDictionary`). If a page doesn't use i18n yet, either bring it into the system as part of the change or explicitly flag the gap rather than adding more hardcoded strings to it.
- **Use the existing i18n system** — do not introduce a second translation mechanism or library without an explicit decision to replace the current one.
- **Keep builds passing.** No change should be considered complete if `npm run build` fails.
- **Run `npm run lint`, `npm run typecheck`, and `npm run build` after every change**, before considering it done. Fix failures; do not suppress them (e.g. do not add to `next.config.ts`'s `ignoreBuildErrors`, do not add blanket eslint-disable comments to hide real issues).
- **Avoid destructive DB operations without explicit confirmation.** Never run `DROP`, `DELETE`, `TRUNCATE`, or schema-altering SQL directly against the live database without the project owner's explicit go-ahead for that specific operation. Prepare migration files and show the exact SQL; let the owner apply it.
- **Do not push or deploy without explicit approval.** Local commits/PRs are fine when asked for; `git push`, triggering a Vercel deploy, or any action affecting the live site requires the owner's explicit confirmation first.
- **Keep changes small and reviewable.** Prefer one focused milestone per change over large multi-concern diffs, especially inside `app/page.tsx`, which is large enough that big diffs there are hard to review safely.

---

# Roadmap

**Phase 1 — Security and project memory** ✅ *mostly complete as of this document*
Remove plaintext password logging, secure unauthenticated admin/write API routes, prepare (not yet apply) the `debug_password_log` drop migration, establish this `PROJECT_MEMORY.md` as the durable handoff document. Remaining before Phase 1 is fully closed: apply the prepared SQL migration, rotate any exposed historical passwords, decide on `/api/auth/confirm-email`'s open verification gap.

**Phase 2 — Refactor `app/page.tsx`**
Break the 4,100-line homepage component into `sections/` (Hero, About, Skills, Contact, etc.) with no behavior change. Extract shared inline interfaces (`BookQuote`, `GalleryItem`, `ITNews`) into `types/`.

**Phase 3 — Move admin features out of the homepage**
Relocate all admin CRUD (book quotes, gallery, CV, IT news editing) from `app/page.tsx` into `admin/`/`features/`, gated behind proper auth, so the public homepage bundle no longer ships admin-only code and UI.

**Phase 4 — Improve i18n and locale routing**
Extend the dictionary system to the currently-hardcoded pages (`/admin`, `/dashboard`, `/knowledge-hub`, auth pages) or make an explicit, documented decision to scope i18n to public pages only. Fix the `<html lang>` and hreflang bugs.

**Phase 5 — SEO and sitemap cleanup**
Complete `sitemap.ts` to include all real routes (project case studies, books, gallery, knowledge-hub). Fix mojibake text corruption in `page.tsx`. Migrate remaining `<img>` tags to `next/image`. Update metadata/JSON-LD to reflect target positioning.

**Phase 6 — Portfolio content upgrade**
Add real case studies, AI/backend/cybersecurity projects, testimonials, GitHub proof, per the Content Strategy section above.

**Phase 7 — Premium UI/UX**
Visual polish pass benchmarked against the Design Direction section (Stripe/Linear/Vercel/Apple/Raycast), building on the existing `globals.css` design tokens.

**Phase 8 — Case studies and Upwork optimization**
Add a services/hire-me section, sharpen the contact funnel per audience (client vs. recruiter), finalize case-study depth for the strongest 3-4 projects.

**Phase 9 — Performance and accessibility**
Address remaining accessibility gaps (alt text, ARIA), performance auditing (bundle size given the current monolith, image optimization), Lighthouse pass.

**Phase 10 — Final production polish**
Tests/CI if adopted, error monitoring, final RLS/security audit close-out, regenerate `lib/database.types.ts`, remove `next.config.ts`'s `ignoreBuildErrors` suppression once the underlying `react-quill` conflict is resolved.

---

# AI Working Instructions

Any AI agent (or human) picking up work on this repository should follow this process:

1. **Inspect before editing.** Read the relevant files fresh — do not assume this document's claims still hold if meaningful time has passed. Verify file paths, line numbers, and current behavior directly rather than trusting a prior summary.
2. **Explain the plan first.** Before making changes, state what you're going to do and why, especially for anything touching security, the database, or `app/page.tsx`. Surface trade-offs to the project owner rather than silently picking one, particularly when an instruction conflicts with actual observed behavior (as happened with the `/api/upload` admin-only vs. any-authenticated-user decision in Phase 1).
3. **Change one milestone at a time.** Follow the Roadmap phases above; don't bundle unrelated concerns (e.g. don't mix a security fix with a UI redesign in the same change).
4. **Preserve existing behavior** for legitimate users unless a change is explicitly about altering behavior. When a security or refactor fix risks breaking a real user-facing flow, find and fix all call sites affected (as was necessary for the `/api/upload` auth fix, which required updating 6 separate client call sites that had never sent an auth token).
5. **Verify after every milestone.** Run `npm run lint`, `npm run typecheck`, and `npm run build` after every change, before declaring it done. If build fails, diagnose and fix — don't hide errors by disabling checks.
6. **Summarize files changed** at the end of every milestone: what changed, why, and what was intentionally left alone.
7. **Report risks.** Explicitly call out anything left unfixed, anything uncertain, and anything that needs the project owner's decision (database changes, deploys, scope trade-offs) rather than silently deciding or silently omitting it.
