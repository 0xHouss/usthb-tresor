# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

USTHB Trésor — a Next.js (App Router) collaborative hub for USTHB students to share and browse academic resources. Stack: Next.js 16 + React 19, TypeScript (strict), Tailwind 4 (CSS-first), shadcn/ui, Prisma 7, NextAuth v4 (Google). Package manager: **pnpm**.

## Commands

- `pnpm dev` — dev server (Turbopack)
- `pnpm lint` — ESLint (`eslint .`; `next lint` was removed in Next 16)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm build` — production build

Run `pnpm lint` and `pnpm typecheck` before reporting a change as done.

## Database (Prisma 7)

- After editing `prisma/schema.prisma`, run `pnpm exec prisma generate` — `prisma db push` does **not** refresh the generated client.
- Import the client from `@/generated/prisma/client` (generated into `src/generated/`, gitignored). Do not import `@prisma/client`.
- The datasource URL lives in `prisma.config.ts`, not in `schema.prisma` (Prisma 7 requirement). Dev DB is SQLite via the better-sqlite3 driver adapter (wired in `src/lib/prisma.ts`).
- Seed with `pnpm exec prisma db seed` (runs `prisma/seed.ts`).

## Toolchain gotchas

- **ESLint is pinned to 9.x — do not bump to 10.** eslint-config-next 16 bundles `eslint-plugin-react@7.37.5`, which only supports eslint `^9.7`; on ESLint 10 `pnpm lint` crashes with `react/display-name: getFilename is not a function`.
- Middleware lives in `src/proxy.ts` (Next 16 renamed the `middleware` convention to `proxy`).
- pnpm requires native build approval via `allowBuilds` in `pnpm-workspace.yaml` (prisma, better-sqlite3, sharp, esbuild). After adding a dep with a build script, set it to `true` there and reinstall.

## Auth & env

- NextAuth `authOptions` live in `src/lib/auth.ts` and **must** be passed to `getServerSession(authOptions)` — otherwise the session callback doesn't run and `session.user.role` is empty. Use the `getUserSession` / `requireUser` / `requireRole` helpers in `src/lib/session.ts`.
- Env vars are validated at boot by `src/lib/env.ts` (zod). See `.env.example` for the full list.
- Pages needing the navbar live under the `src/app/(app)/` route group; `/login` is intentionally outside it (full-screen).

## Conventions

- **Branches:** feature branches off `dev`, merged into `dev` via PR when the feature is done; `dev` is merged into `main` via PR once a meaningful batch of features is tested. Don't commit directly to `main`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`…). Never add a `Co-Authored-By` trailer.
- **UI language:** all user-facing text is in French for now (a fr/en language selector is planned later).
