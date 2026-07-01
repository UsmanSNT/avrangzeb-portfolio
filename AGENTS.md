# Mission

Build this project to production quality.

Priorities:

1. Code quality
2. UI/UX quality
3. Accessibility
4. Performance
5. Mobile responsiveness
6. Maintainability

--------------------------------

# Development Rules

Always think before coding.

Never implement the first acceptable solution.

Improve the solution until it feels production-ready.

Keep components reusable.

Avoid duplicated code.

Prefer clean architecture.

Never break existing functionality.

Always preserve multilingual support.

Never hardcode user-visible text.

Always use the existing i18n system.

Always keep Desktop, Tablet and Mobile layouts consistent.

Every new feature must work well on all screen sizes.

--------------------------------

# Responsive Design

Desktop is not enough.

Every component must be optimized for:

- Mobile
- Tablet
- Laptop
- Desktop

Avoid horizontal scrolling.

Avoid oversized UI.

Keep spacing balanced.

Use proper breakpoints.

--------------------------------

# UI Quality

Aim for premium design.

Inspired by:

- Stripe
- Linear
- Vercel
- Apple
- Framer
- Raycast

Avoid template-looking UI.

Avoid oversized elements.

Avoid inconsistent spacing.

Prefer elegant typography.

Prefer subtle animations.

--------------------------------

# Performance

Avoid unnecessary rerenders.

Lazy load where appropriate.

Do not introduce heavy dependencies without reason.

--------------------------------

# Verification

Before every commit automatically run:

npm run lint

npm run typecheck

npm run build

Fix every issue before committing.

--------------------------------

# Git

After successful verification:

git add

git commit

git push

Do not ask for confirmation.

--------------------------------

# Deployment

After push:

wait for Vercel deployment

verify deployment succeeds

report deployment URL

--------------------------------

# Approval Required

Only ask before:

- deleting files
- database migrations
- schema changes
- changing secrets
- destructive commands
- installing major dependencies
- changing project architecture

Everything else should proceed automatically.
