# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

REST API for a veterinary practice management system (Ponyvet). Fastify 5 + Prisma 7 (PostgreSQL) + Zod 4 + Better Auth + TypeScript (ESM), package manager is **pnpm**.

`docs/PROYECT.md` is the authoritative data-model spec (in Spanish) — entities, fields, and business rules. Read it before changing the Prisma schema or adding modules.

## Commands

```bash
pnpm dev              # tsx watch src/server.ts
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint .
pnpm build            # prisma generate && tsc && cp -r src/generated dist/
pnpm start            # node dist/server.js

pnpm db:generate      # prisma generate  (required after any schema.prisma change)
pnpm db:migrate:dev   # prisma migrate dev  (local: create + apply migration)
pnpm db:migrate       # prisma migrate deploy  (production)
```

There is no test suite (`pnpm test` is a stub). Verification = `pnpm typecheck && pnpm lint`, which is what CI runs. The husky pre-commit hook runs `pnpm lint`.

Requires a `.env` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and optionally `PORT` (see `.env.example`).

The initial ADMIN user is not seeded manually — `bootstrap-admin.ts` creates one automatically on app startup if no `ADMIN` user exists yet, reading `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` from the environment (creation is skipped with a warning if any of the three is missing), via `auth.api.createUser`.

### Auth (Better Auth)

Authentication is handled by [Better Auth](https://better-auth.com), configured as a module-level singleton in `src/lib/auth.ts` (with `src/lib/prisma.ts` and `src/lib/permissions.ts` as its dependencies — a separate singleton from the `app.prisma` decorator, since `auth` must exist outside the Fastify request lifecycle). Better Auth is **ESM-only**, which is why the whole project builds as ESM (`"type": "module"` + `moduleResolution: "NodeNext"` — every relative import needs an explicit `.js` extension).

- Native routes only, mounted as a catch-all at `/api/auth/*` in `src/app.ts` (e.g. `POST /api/auth/sign-in/email`, `POST /api/auth/sign-out`, `GET /api/auth/get-session`). There is no `/auth` module wrapping these — the frontend calls Better Auth's endpoints directly.
- Public sign-up is disabled (`emailAndPassword.disableSignUp: true`); accounts are only created through `POST /users/register`, which calls `auth.api.createUser` internally (see `users.services.ts`).
- Roles (`ADMIN`, `VETERINARIAN`, `CLIENT`) are modeled via the `admin` plugin with custom roles defined in `src/lib/permissions.ts`. `clientId` and `isActive` are declared as `user.additionalFields` (`input: false`) so they flow into the session without being settable by the client.
- `User.role` stays a Prisma enum (`UserRole`) for DB-level validation even though Better Auth treats it as a plain string — role changes should go through `PUT /users/:id` (validated with `z.enum(UserRole)`), not `/api/auth/admin/set-role`.

## Architecture

### Composition

`src/server.ts` only loads dotenv and listens. `src/app.ts` (`buildApp()`) is the full composition root: CORS → plugins → route registration with prefixes. New modules must be imported and registered there with their URL prefix.

### Plugins (`src/plugins/`, all wrapped in `fastify-plugin`)

- `prisma.ts` — connects the `src/lib/prisma.ts` singleton, decorates `app.prisma`, disconnects on close.
- `bootstrap-admin.ts` — registered right after `prisma.ts` (registration order guarantees `app.prisma` exists first); creates the initial `ADMIN` user from `SEED_ADMIN_*` env vars if none exists yet, via `auth.api.createUser`. No decorators.
- `auth.ts` — decorates `app.authenticate`: calls `auth.api.getSession()` (reading the session cookie via `fromNodeHeaders(req.headers)`), sets `req.session`, and replies 401 if there's no session or the user's `isActive` is `false`.
- `authorization.ts` — decorates `app.authorize(roles)` and `app.authorizeClient`, both built on top of `app.authenticate`. **Currently declared but not used by any route** — every module today applies only `app.authenticate`. Use these when adding role-gated endpoints rather than hand-rolling role checks.

Decorator types and `req.session` live in `src/types/fastify.d.ts`.

### Module layout (`src/modules/<name>/`)

Four files per module, strictly layered:

- `*.routes.ts` — default-exports `function (app: FastifyInstance)`. First line is almost always `app.addHook('preHandler', app.authenticate)` to protect the whole module. **Static paths must be declared before `/:id`** (e.g. `/active`, `/low-stock`, `/date-range`).
- `*.controller.ts` — named exports ending in `Controller`. Parses `req.body` / `req.params` / `req.query` with the Zod schemas, calls the service via `req.server.prisma`, sets status codes. Services returning `null` map to 404; creates return 201; deletes return 204.
- `*.service.ts` — plain exported functions whose first parameter is `prisma: FastifyInstance['prisma']`. No Fastify types beyond that; all Prisma access lives here.
- `*.schema.ts` — Zod schemas plus `z.infer` DTO exports. Update schemas derive from create schemas (`createXSchema.partial()`).

Existing modules: `users`, `clients`, `pets`, `medical-records`, `consultations`, `visits`, `vaccination`, `medications`, `inventory`. There is no `auth` module — auth endpoints are Better Auth's own catch-all (see below).

### Conventions that matter

- **Soft deletes.** Entities carry `isActive`; delete endpoints flip the flag. Read queries must filter `where: { isActive: true }`, and update/delete services first `findFirst` on the active row and return `null` when missing so the controller can 404.
- **Prisma types are imported from the generated client**, not `@prisma/client`: `import type { Prisma } from '../../generated/prisma/client.js'`. `src/generated/prisma` is gitignored — run `pnpm db:generate` before typechecking on a fresh clone.
- **ESM**: every relative import needs an explicit `.js` extension (`moduleResolution: "NodeNext"`), even though the source files are `.ts`.
- **Pagination** — list endpoints that paginate take `page`/`limit` via `z.coerce.number()` with defaults (1 / 10, max 100) and return `{ data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }`.
- **Validation is done inside controllers** with `schema.parse(...)`; Fastify route-level JSON schemas are not used, and there is no custom error handler, so a Zod failure surfaces as a generic 500.
- **Auth session shape** is `req.session` (`{ session, user }`, set by `app.authenticate`), typed in `src/types/fastify.d.ts` from `Awaited<ReturnType<typeof auth.api.getSession>>`; role/clientId/isActive live on `req.session.user`.
- Style: no semicolons, single quotes (Prettier via VS Code settings). ESLint enforces `no-console` (warn), `require-await`, and `import type` for type-only imports; `_`-prefixed identifiers are exempt from unused-vars.
- User-facing response messages are in Spanish; code, identifiers, and most comments are in English.

## Deployment

`.github/workflows/deploy.yml`: every push/PR to `main` runs generate → typecheck → lint → build. Pushes to `main` additionally SCP `dist/` to a DigitalOcean box, `git pull`, `pnpm install --frozen-lockfile`, `pnpm db:migrate`, then `pm2 restart ecosystem.config.cjs --env production`. Migrations therefore run automatically on deploy — a schema change merged to `main` hits production DB immediately.

CORS origins are hardcoded in `src/app.ts` (`http://localhost:5173`, `https://app.ponyvet.com`); a new frontend origin must be added there.
