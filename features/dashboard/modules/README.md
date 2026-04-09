# Dashboard Modules Architecture

This folder is the feature-first boundary for dashboard module flows (`Welcomer`, `Leaver`).

## Goals

- Keep module business logic out of route files.
- Reuse one implementation for all module slugs (`/welcome`, `/leave`).
- Preserve legacy imports during migration with compatibility relays in `state/*`, `providers/*`, and `lib/actions.ts`.

## Structure

```text
features/dashboard/modules/
├── actions/
│   ├── source-actions.ts
│   ├── image-card-actions.ts
│   └── index.ts
├── providers/
│   ├── source-store-provider.tsx
│   ├── image-card-store-provider.tsx
│   └── index.ts
├── stores/
│   ├── source-store.ts
│   ├── image-card-store.ts
│   └── index.ts
├── views/
│   ├── module-page-view.tsx
│   └── module-image-page-view.tsx
├── config.ts
└── README.md
```

## Rules

- `app/*` files only resolve params and compose views.
- `actions/*` always enforce permission checks (`getUserGuild`) before mutations.
- `actions/*` always call `revalidatePath` after successful writes.
- `actions/*` use `AppError` + `handleServerError` + `reportError` for operational failures.
- `stores/*` and `providers/*` are client-only state primitives for editor/image-editor.

## Migration status

- Dynamic route migration done: `app/dashboard/[guildId]/[module]/*`.
- Store/provider migration done to feature-first paths (`features/dashboard/modules/{stores,providers}`).
- Actions extraction done to `features/dashboard/modules/actions/*`.
- Legacy relays removed: `state/{source,imageCard}.ts`, `providers/{sourceStoreProvider,imageCardStoreProvider}.tsx`.
- Guardrails added in `eslint.config.mjs` to prevent importing removed paths.
- Remaining work: keep auth-only actions in `lib/actions.ts` stable, then continue feature migration outside dashboard.


