# CLAUDE.md

Guidance for Claude Code in this repo. Supplements `AGENTS.md` — read that first for architecture, data model, and domain patterns.

## Stack

- **Next.js 16** (App Router) + **React 19.2** + **TypeScript**
- **Yarn 4** (`yarn@4.12.0`) — never `npm install`
- **Prisma 7** — client generated to `generated/prisma/` (not `node_modules`); migrations: `npx prisma migrate dev` (uses `prisma.config.ts`)
- **Tailwind v4** + **HeroUI v2** + **Zustand**
- No test suite — verification is `yarn lint` + `yarn build` + manual route checks. Pre-commit runs lint via Husky.

## Commands

```bash
yarn dev          # dev server
yarn dev-turbo    # dev server with Turbopack
yarn build        # production build
yarn lint         # ESLint (also pre-commit)
```

## Next.js 16 Essentials

### Async request APIs

`cookies()`, `headers()`, `draftMode()`, route `params`, and `searchParams` are all `Promise`-returning. Always `await` them:

```ts
// Page / Layout
export default async function Page(props: {
  params: Promise<{ guildId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { guildId } = await props.params;
  const { tab } = await props.searchParams;
}

// Route Handler
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
}

// Server function
import { cookies, headers } from "next/headers";
const cookieStore = await cookies();
const h = await headers();
```

Never use the `UnsafeUnwrappedCookies` escape hatch — it exists only for incremental migration.

### Caching model

- `fetch` is **no longer cached by default**. Opt in per-call with `{ cache: "force-cache" }` or `next: { revalidate: N }`.
- For function-level memoization, wrap reads in React's `cache(...)` (DAL already does this).
- For route-segment caching, prefer the `"use cache"` directive on a layout/page/function over `export const revalidate`. Requires `cacheComponents: true` in `next.config.ts` (not currently enabled — check before using).
- Mutations: call `revalidatePath(...)` or `revalidateTag(...)` from server actions after writes (pattern already in `lib/actions.ts`).

### Error & not-found conventions

Use framework file conventions instead of custom error plumbing:

- `error.tsx` — segment-scoped error boundary (client component, receives `{ error, unstable_retry }`)
- `global-error.tsx` — root-level fallback; must render its own `<html><body>`
- `not-found.tsx` — rendered when `notFound()` is called
- `forbidden.tsx` / `unauthorized.tsx` — paired with `forbidden()` / `unauthorized()` from `next/navigation` (403 / 401)
- `loading.tsx` — Suspense fallback for the segment

In server code, throw by calling the helper — don't hand-roll responses:

```ts
import { notFound, redirect, forbidden, unauthorized } from "next/navigation";
```

## Project-Specific Pitfalls

### DAL: `server-only`, not `"use server"`

Files under `lib/dal/` must start with `import "server-only";` — **never** `"use server"`. The `"use server"` pragma turns every export into a client-callable RPC endpoint and hides violations where client components import DAL directly.

If a client component needs DAL data:
- pass it as a prop from a server component, **or**
- wrap the DAL call in an explicit server action under `features/*/actions/` or `lib/actions.ts`.

A client module must never import from `lib/dal/*` directly.

Note: `lib/dal/` is split by domain (`session.ts`, `sources.ts`, `discord.ts`, `logging.ts`) — `AGENTS.md` still references the old `lib/dal.ts` path.

### Don't re-throw framework control-flow errors

Next signals control flow by throwing errors with specific `digest` prefixes. Catching these breaks the framework. If you wrap server code in `try/catch`, re-throw anything matching these digests:

| Digest prefix           | Thrown by                       | Must re-throw |
| ----------------------- | ------------------------------- | ------------- |
| `DYNAMIC_SERVER_USAGE`  | reading `cookies()`/`headers()` during a statically-rendered segment | yes |
| `NEXT_REDIRECT`         | `redirect()` / `permanentRedirect()` | yes |
| `NEXT_NOT_FOUND`        | `notFound()`                    | yes |
| `NEXT_HTTP_ERROR_FALLBACK;403` | `forbidden()`            | yes |
| `NEXT_HTTP_ERROR_FALLBACK;401` | `unauthorized()`         | yes |

Pattern:

```ts
try {
  return await doWork();
} catch (err) {
  const digest = (err as { digest?: string }).digest ?? "";
  if (
    digest.startsWith("DYNAMIC_SERVER_USAGE") ||
    digest.startsWith("NEXT_REDIRECT") ||
    digest.startsWith("NEXT_NOT_FOUND") ||
    digest.startsWith("NEXT_HTTP_ERROR_FALLBACK")
  ) {
    throw err;
  }
  logError(err);
  return null;
}
```

Never blanket-catch-return-null in DAL functions that read `cookies()` — let errors propagate to the segment's `error.tsx`.

### Dynamic rendering: Suspense, not `force-dynamic`

Routes that depend on session/cookies must **not** use `export const dynamic = "force-dynamic"`. Instead:

1. Keep the page default export sync (static shell).
2. Extract the async cookie-reading logic into a child component.
3. Wrap the child in `<Suspense fallback={...}>` — reuse loaders from `components/ui/loaders/`.

Reference: `app/(home)/dashboard/page.tsx`.

### Barrel imports leak `server-only` into the client

Barrels (e.g. `components/dashboard/guild/index.ts`) re-export both client and server components. When a `"use client"` module imports from the barrel, Turbopack pulls the whole barrel — including anything touching `next/headers` or `server-only` — into the client bundle.

From any `"use client"` file, import the specific source file path:

```ts
// ❌ in a client component
import { GuildSelectDropdown, LogoutIcon } from "@/components/dashboard/guild";

// ✅
import GuildSelectDropdown from "@/components/dashboard/guild/guild-select-dropdown";
import { LogoutIcon } from "@/components/dashboard/guild/logout-icon";
```

### Server actions: always gate on `getUserGuild`

Every mutation in `lib/actions.ts` must call `getUserGuild(guildId)` (or `requireAdminUser()`) **before** touching the DB. Throw `AppError` with `PERMISSION_DENIED` on failure. See `lib/error.ts` for the helpers.

### Pick the runtime boundary that matches the side effect

Before writing auth/redirect/cookie code, decide which boundary it belongs in. Getting this wrong produces errors that look like bugs but are category mistakes.

- **Side effect drives where the code lives, not convenience.** Cookie writes and redirect-to-external-URL are side effects with specific allowed contexts. Server Actions and Route Handlers may mutate cookies; Page/Layout renders may not. Putting the wrong side effect in a render throws a framework error, not a logic bug — don't try to work around it, move the code.
- **Server Actions are for mutations, not navigations.** If the handler's job is `redirect(someExternalUrl)` with no state change the user cares about, it doesn't belong in a Server Action. The action RPC layer is designed for form/mutation semantics; using it as a navigation trampoline invites duplicate fetches, prefetch races, and harder-to-reason-about request lifecycles. Use a plain `<a href>` / `<Link>` for navigation triggers.
- **Keep security-critical flows off the client.** CSRF state validation, token exchange, session creation — if it's in a client component's `useEffect`, it's wrong. React StrictMode double-invokes effects in dev; ref/flag guards are a smell, not a fix. Move the logic to a Route Handler so it runs once per request by construction.
- **Single-writer discipline for CSRF/state cookies.** A token stored in a cookie and validated on callback assumes exactly one writer between issue and check. If two requests can hit the issuing endpoint concurrently (prefetch, double-submit, action-redirect fan-out), the second silently overwrites the first and validation fails with a mismatch. The fix is upstream: ensure one request reaches the issuer per flow — not a resilience hack on the validator.
- **When debugging a "StrictMode bug," first ask whether the code should be on the client at all.** StrictMode exposes effects that aren't idempotent. The usual correct answer for auth/OAuth/session code isn't "make the effect idempotent" — it's "this isn't client code."

## Commits

Split refactors into multiple commits along logical boundaries, not per file. Use `git add -p` to stage partial hunks (non-interactive: `printf 'y\nn\n' | git add -p <file>`). Stage explicitly — never `git add -A`: the working tree often has unrelated in-progress changes.

Commit subject style matches existing history: sentence-case imperative, **no** conventional-commit prefix (e.g. `Remove use server pragma from DAL session module`).
