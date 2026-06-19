# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

USTHB Trésor — a collaborative resource hub where USTHB students share and browse academic resources (lectures, worksheets, exams). Next.js 16 App Router + Prisma full-stack app. Contributions go through a moderation flow: uploads land in `PendingFile`; a Moderator/Admin approves them, promoting the record to `File`. Roles are User / Moderator / Admin (`UserRole` enum).

## Commands

Package manager is **pnpm**.

- `pnpm dev` — dev server (Next.js + Turbopack)
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit` (not part of lint; run it before assuming type-correctness)
- `pnpm test` — Vitest unit tests, run once (`pnpm test:watch` for watch)
- `pnpm seed` — seed dev DB (`prisma/seed.ts` via tsx, uses faker)

Tests are unit-only (Node env, Vitest), matched by `src/**/*.test.ts`.

## Stack notes

- **Prisma 7** with the **pg driver adapter** (`@prisma/adapter-pg`) — PostgreSQL (also for local dev). This is a driver-adapter setup, not Prisma's built-in engine; the `prisma-driver-adapter-implementation` skill is the reference for adapter work. Schema/seed/migration config lives in `prisma.config.ts`. The connection string comes from `DATABASE_URL`.
- **NextAuth.js v5 (beta)** with Google OAuth via `@auth/prisma-adapter`.
- **Tailwind v4** — CSS-first config in `src/app/globals.css` (`@import "tailwindcss"`, `@theme`, `@plugin`); there is no `tailwind.config`. shadcn/ui (new-york style); use the `shadcn` skill when adding components.
- Path alias `@/*` → `./src/*`.

## Gotchas

- **ESLint stays on 9.x** — do not bump to 10; the eslint-config-next plugin chain breaks on 10.
- `eslint.config.mjs` deliberately demotes `react-hooks/set-state-in-effect` and `react-hooks/refs` to warnings so pre-existing patterns (e.g. shadcn `use-mobile`) don't block lint. Don't re-promote them without fixing the underlying code.
- `next.config.ts` sets Server Action `bodySizeLimit: '30mb'` on purpose — it must stay above the 25 MB upload cap plus form overhead.
- Required env vars are in `.env.example` (DB, `AUTH_GOOGLE_*`, `AUTH_SECRET`, `GOOGLE_DRIVE_*`). File storage uses Google Drive over OAuth and needs `GOOGLE_DRIVE_REFRESH_TOKEN`.

## Conventions

- Conventional commits with scopes, e.g. `feat(storage):`, `fix(ui/browse-page):`.
- Do **not** add `Co-Authored-By` trailers to commit messages.
