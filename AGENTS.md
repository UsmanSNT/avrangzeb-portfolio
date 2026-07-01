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

# Project Identity

Project Name:
Avrangzeb Portfolio

Purpose:

A premium personal portfolio for Abdujalilov Avrangzeb.

The website should represent:

- Software Engineer
- AI Engineer
- Cybersecurity Engineer
- Network Engineer
- Backend Developer

Audience:

- Recruiters
- International companies
- Clients
- Startup founders
- Technical interviewers

Primary goal:

Demonstrate engineering quality rather than simply showcasing projects.

Every design decision should increase credibility.

--------------------------------

# Design Philosophy

Minimal.

Professional.

Modern.

Technical.

Elegant.

Confident.

Never flashy.

Never template-looking.

--------------------------------

# Inspiration

Use the design quality of:

- Stripe
- Linear
- Vercel
- Apple
- Raycast
- GitHub
- Anthropic

Do NOT copy.

Take inspiration from spacing, hierarchy, typography and polish.

--------------------------------

# UX Rules

Every page should answer:

Who is this engineer?

What can he build?

Why should I trust him?

How can I contact him?

Every screen should have a clear purpose.

--------------------------------

# Quality Standard

Before considering any feature complete, ask internally:

Would this impress a senior engineer at Google, Microsoft, OpenAI or Stripe?

If not, continue improving.

--------------------------------

# Development Workflow

This project follows an iterative engineering workflow.

For every feature:

Phase 1
Architecture

- Analyze the existing implementation.
- Identify reusable components.
- Avoid duplicate logic.

Phase 2
Implementation

- Implement only the requested scope.
- Do not modify unrelated code.
- Keep changes small and maintainable.

Phase 3
Review

Before finishing, review your own implementation.

Ask yourself:

- Can this component be cleaner?
- Can this UI be more professional?
- Is the mobile version excellent?
- Is accessibility preserved?
- Is performance preserved?
- Is the code reusable?

Improve the implementation before verification.

--------------------------------

# Deployment Workflow

Automatically perform:

npm run lint

npm run typecheck

npm run build

If build fails:

- diagnose
- fix
- build again

Do not stop after the first failure.

--------------------------------

# Vercel

After every successful push:

- Wait for Vercel deployment.
- Verify deployment completed successfully.
- Verify the homepage loads.
- Verify there are no runtime errors.
- Return deployment URL.

--------------------------------

# UI Review

After every UI sprint:

Review the page as if you were:

- Senior Frontend Engineer
- Product Designer
- UX Designer

List:

- strengths
- weaknesses
- possible improvements

before ending the sprint.

--------------------------------

# Mobile First

Desktop is important.

Mobile is mandatory.

Every feature must be reviewed on:

- Mobile
- Tablet
- Laptop
- Desktop

Never finish a sprint without checking all breakpoints.

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
