# AGENTS Guide

## Scope and Stack

- Next.js App Router project (React 19 + TypeScript) with Discord OAuth2 login and guild management flows.
- Primary data store is Postgres via Prisma; generated client lives in `generated/prisma` (not in `node_modules`).
- UI is HeroUI + Tailwind v4; state-heavy dashboard editors use Zustand stores in `state/*` with providers in
  `providers/*`.

## Architecture Map (Follow This Flow)

- Auth entrypoints: `app/api/auth/login/route.ts` -> `app/api/auth/callback/route.ts` -> JWT cookie helpers in
  `lib/session.ts`.
- Route protection is centralized in `proxy.ts`: `/dashboard` requests without session redirect to login and set
  `redirectAfterLogin`.
- Data boundary is `lib/dal.ts` (`"use server"` + `server-only`): Prisma reads/writes + Discord REST + session-derived
  context.
- Mutation boundary is `lib/actions.ts`: server actions enforce `getUserGuild(...)`, persist changes, then call
  `revalidatePath(...)`.
- Discord wrappers are class-based (`lib/discord/guild.ts`, `lib/discord/user.ts`) and usually exposed to UI via
  `.toObject()`.

## Data Model and Domain Conventions

- Core models: `Guild`, `Source`, `ImageCard`, `Session`, `User` in `prisma/schema.prisma`.
- `Source.message` is JSON (Discord payload); validation happens at write time via `MessageBuilder` in `lib/actions.ts`.
- Module URLs are derived from enum names with `module.slice(0, -1).toLowerCase()` (example:
  `components/dashboard/guild/manage-button.tsx`).
- New sources are seeded in `lib/dal.ts#createSource` (default message + `activeCard` + stats bootstrap).

## Developer Workflows (Project-Specific)

- Package manager is Yarn 4 (`packageManager: yarn@4.12.0`), but Husky pre-commit currently runs `npm run lint` (
  `.husky/pre-commit`).
- Main commands from `package.json`: `yarn dev`, `yarn dev-turbo`, `yarn build`, `yarn start`, `yarn lint`.
- No `test` script exists currently; rely on lint/build plus manual route checks.
- Prisma config is `prisma.config.ts`; generated client output path is set in `prisma/schema.prisma`.

## Integrations and Required Env

- Discord OAuth: `NEXT_PUBLIC_DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `REDIRECT_URI`.
- Bot/internal APIs: `DISCORD_BOT_TOKEN`, `BOT_ID`, `INTERNAL_API_BASE_URL`, `SERVER_TOKEN`.
- Session/database: `SESSION_SECRET`, `DATABASE_URL`.
- Observability: Sentry (`instrumentation.ts`, `sentry.*.config.ts`) and Plausible (`app/providers.tsx`).

## Implementation Patterns to Preserve

- Keep server-only logic in `lib/dal.ts` and `lib/actions.ts`; client code should call server actions, not Prisma.
- Preserve cache + revalidation behavior (`cache(...)` in reads, `revalidatePath(...)` in writes).
- Keep permission checks before mutations (`getUserGuild(...)` pattern in `lib/actions.ts`).
- Reuse singletons for infra clients (`lib/prisma.ts`, `lib/discord/rest.ts`, `lib/discord/status.ts`) to avoid
  duplicate dev connections.
- Use `@/*` path aliases from `tsconfig.json` and existing lint/format stack (`eslint.config.mjs`, Prettier).

