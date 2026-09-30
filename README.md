# USTHB Trésor

A collaborative resource hub where USTHB students share and browse academic resources: lectures, worksheets (TD/TP), interrogations and past exams.

Anyone can browse and download published files. Signed-in students contribute new ones, and every contribution is reviewed by a moderator before it goes live. The interface is available in French (default) and English.

## Features

- **Browse and filter** published resources by major, module, professor, type, academic level, year, semester, section, group and document language.
- **French and English UI**, with the language in the URL (`/fr/...`, `/en/...`) and a switcher in the header. Documents are tagged with the language they're written in, independently of the UI language.
- **File pages** with an embedded preview, download and "open in Drive" links, full details, and who shared the file.
- **Contribute** a PDF (up to 25 MB) with its metadata. Contributors can choose to **submit anonymously**: the file is published as usual, but the uploader is never shown publicly. Moderators and admins can still see who it was.
- **Moderation**: submissions wait in a review queue until a moderator approves or rejects them.
- **Comments** on file pages for signed-in users. Authors and moderators can delete them.
- **Problem reports**: signed-in users can report a corrupted file, wrong details, a copyright issue or anything else. Moderators resolve or dismiss reports; admins can also delete the file.
- **Admin dashboard**: key figures, 30-day download and submission charts, the most downloaded files and the most active contributors. Downloads are counted anonymously.
- **Audit log**: sign-ins, submissions, approvals, rejections, comments, reports and deletions, filterable by event type (admins only).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) with Turbopack
- [Prisma 7](https://www.prisma.io) on PostgreSQL, through the `pg` driver adapter
- [Better Auth](https://www.better-auth.com) with Google sign-in and database sessions
- Google Drive for file storage (over OAuth)
- [next-intl](https://next-intl.dev) for internationalization
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev) for validation, [Vitest](https://vitest.dev) for unit tests

## Getting started

Prerequisites: Node.js, [pnpm](https://pnpm.io) and Docker.

```bash
pnpm install

# Start PostgreSQL (exposed on port 5435)
docker compose up -d

# Configure the environment, then fill in the values
cp .env.example .env

# Apply migrations, generate the Prisma client and start the dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000), which redirects to `/fr` or `/en` depending on your browser's language. To fill the local database with sample data, run `pnpm seed`.

### Environment variables

All variables are documented in [`.env.example`](.env.example) and validated by `src/lib/env.ts`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (the default matches `compose.yaml`) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google OAuth client used for sign-in. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` |
| `BETTER_AUTH_SECRET` | Session signing secret, at least 32 characters (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Base URL of the app |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive folder that receives uploaded files |
| `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET`, `GOOGLE_DRIVE_REDIRECT_URI`, `GOOGLE_DRIVE_REFRESH_TOKEN` | OAuth credentials for the Drive account that stores files. Mint the refresh token with e.g. the OAuth Playground |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Applies pending migrations, regenerates the Prisma client and starts the dev server |
| `pnpm build` | Generates the client, applies migrations (skipped on Vercel preview deployments) and builds the app |
| `pnpm lint` | Runs ESLint |
| `pnpm typecheck` | Runs `tsc --noEmit` (not part of lint) |
| `pnpm test` | Runs the Vitest unit tests once (`pnpm test:watch` to watch) |
| `pnpm seed` | Seeds the development database with fake data |

## Database migrations

Migrations live in `prisma/migrations` and are applied automatically by `pnpm dev` and `pnpm build`. Preview deployments on Vercel skip them, so unmerged branches never migrate a shared database.

To change the schema:

1. Edit `prisma/schema.prisma`.
2. Create and apply a migration: `pnpm prisma migrate dev --name <name>`.
3. Regenerate the client: `pnpm prisma generate` (Prisma 7's `migrate dev` no longer does it).

When a change renames a column, edit the generated SQL by hand so the data is moved rather than dropped.

## Translations

UI text lives in `messages/fr.json` and `messages/en.json`, and pages sit under `src/app/[locale]/`. To add or change text:

1. Add the key to **both** catalogues. Keys are type-checked against `fr.json`, and a unit test fails if the two catalogues drift apart.
2. Read it with `useTranslations` (client and synchronous server components) or `getTranslations` (async server code).
3. For links and redirects, use `Link`, `redirect`, `useRouter` and `usePathname` from `@/i18n/navigation` so the current locale is kept.

Document metadata (module and professor names, etc.) is not translated: it stays in the document's own language.

## Roles and moderation

Every account has one of three roles:

| Role | Can |
| --- | --- |
| **User** | Browse and download, contribute files, comment, report problems |
| **Moderator** | Everything above, plus review submissions (`/submissions`), handle reports and see the dashboard (`/admin`) |
| **Admin** | Everything above, plus delete reported files and read the audit log (`/admin/logs`) |

New accounts are Users. Roles are changed only by writing to the database directly, e.g. `UPDATE "User" SET role = 'Moderator' WHERE email = '...';`.

Contributions go through moderation. An upload is stored on Drive and saved as a `PendingFile`. When a moderator approves it, it's promoted to a `File` and appears in the catalogue; a rejected submission is never listed.

## Contributing

- Branch off `dev` with a feature branch (`feat/...`, `fix/...`, `docs/...`) and open a pull request into `dev` when the feature is done.
- `dev` is merged into `main` once a batch of features has been tested. Don't commit to `main` directly.
- Use [Conventional Commits](https://www.conventionalcommits.org) with a scope, e.g. `feat(storage): ...` or `fix(ui/browse-page): ...`.
- Run `pnpm typecheck`, `pnpm lint` and `pnpm test` before pushing; CI runs them on every pull request.
