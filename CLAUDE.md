# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

USTHB Trésor — a collaborative resource hub where USTHB students share and browse academic resources (lectures, worksheets, exams). Next.js 16 App Router + Prisma full-stack app. Contributions go through a moderation flow: uploads land in `PendingFile`; a Moderator/Admin approves them, promoting the record to `File`. Roles are User / Moderator / Admin (`UserRole` enum).

## Commands

Package manager is **pnpm**.

- `docker compose up -d` — local PostgreSQL on port **5435** (5433/5434 are used by other projects on this machine)
- `pnpm dev` — applies pending migrations (`prisma migrate deploy`), regenerates the Prisma client, then starts the dev server (Next.js + Turbopack)
- `pnpm build` — generates the client, runs `pnpm db:deploy`, then `next build`. `db:deploy` applies pending migrations but is a no-op on Vercel preview deployments (`VERCEL_ENV=preview`), so unmerged branches never migrate a shared database
- Schema changes: author migrations with `pnpm prisma migrate dev --name <name>`; they are applied automatically everywhere else. Hand-edit the SQL when a change renames columns, so data isn't dropped
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit` (not part of lint; run it before assuming type-correctness)
- `pnpm test` — Vitest unit tests, run once (`pnpm test:watch` for watch)
- `pnpm seed` — seed dev DB (`prisma/seed.ts` via tsx, uses faker)

Tests are unit-only (Node env, Vitest), matched by `src/**/*.test.ts`.

## Stack notes

- **Prisma 7** with the **pg driver adapter** (`@prisma/adapter-pg`) — PostgreSQL (also for local dev). This is a driver-adapter setup, not Prisma's built-in engine; the `prisma-driver-adapter-implementation` skill is the reference for adapter work. Schema/seed/migration config lives in `prisma.config.ts`. The connection string comes from `DATABASE_URL`.
- **Better Auth** with Google OAuth, via its Prisma adapter (`better-auth/adapters/prisma`) and database sessions. Server config is `src/lib/auth.ts`; the handler is mounted at `src/app/api/auth/[...all]`. Read the session through `src/dal/session.ts` (`getCurrentUser` / `requireUser` / `requireModerator`), not `auth.api.getSession` directly. `role` is a server-owned `user.additionalFields` entry (`input: false`) — change roles only via direct DB writes. Sign-in/out run as Server Actions (`src/actions/auth-actions.ts`), which relies on the `nextCookies()` plugin staying last in `plugins`.
- **Tailwind v4** — CSS-first config in `src/app/globals.css` (`@import "tailwindcss"`, `@theme`, `@plugin`); there is no `tailwind.config`. shadcn/ui (new-york style); use the `shadcn` skill when adding components.
- Path alias `@/*` → `./src/*`.

## Gotchas

- **ESLint stays on 9.x** — do not bump to 10; the eslint-config-next plugin chain breaks on 10.
- `eslint.config.mjs` deliberately demotes `react-hooks/set-state-in-effect` and `react-hooks/refs` to warnings so pre-existing patterns (e.g. shadcn `use-mobile`) don't block lint. Don't re-promote them without fixing the underlying code.
- `next.config.ts` sets Server Action `bodySizeLimit: '30mb'` on purpose — it must stay above the 25 MB upload cap plus form overhead.
- Required env vars are in `.env.example` (DB, `AUTH_GOOGLE_*`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_DRIVE_*`). File storage uses Google Drive over OAuth and needs `GOOGLE_DRIVE_REFRESH_TOKEN`.

## Conventions

- **Branches:** feature branches off `dev`, merged into `dev` via PR when the feature is done; `dev` is merged into `main` via PR once a meaningful batch of features is tested. Don't commit directly to `main`.
- **UI language:** the UI is in French (default) and English via **next-intl**, with the locale as a URL prefix (`/fr/...`, `/en/...`). Pages live under `src/app/[locale]/`; `src/proxy.ts` picks the locale; `/api` routes stay unprefixed. Never hard-code user-facing text: add the key to **both** `messages/fr.json` and `messages/en.json` (a test checks they match) and use `useTranslations` / `getTranslations`. Keys are type-checked against `fr.json`. Use `Link` / `redirect` / `useRouter` / `usePathname` from `@/i18n/navigation` (not `next/link` or `next/navigation`) so the locale is kept, and `revalidateLocalized` (`src/lib/revalidate.ts`) instead of `revalidatePath`. Enum labels (file types, languages, ...) live under `enums` in the catalogues.
- **Errors in actions:** zod schemas and `AppError` (`src/lib/errors.ts`) carry message *keys* from the `errors` catalogue; actions translate them with `getErrorTranslator()`. Unexpected errors are shown as a generic message.
- **Document language** (`File.language`, `PendingFile.language`) is separate from the UI language: document metadata (module names, etc.) stays in the document's own language.
- Conventional commits with scopes, e.g. `feat(storage):`, `fix(ui/browse-page):`.
