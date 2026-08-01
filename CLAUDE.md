# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

REST API for a veterinary practice management system (Ponyvet). Fastify 5 + Prisma 7 (PostgreSQL) + Zod 4 + TypeScript, package manager is **pnpm**.

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
pnpm db:seed          # creates the initial ADMIN user only
```

There is no test suite (`pnpm test` is a stub). Verification = `pnpm typecheck && pnpm lint`, which is what CI runs. The husky pre-commit hook runs `pnpm lint`.

Requires a `.env` with `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT` (see `.env.example`).

## Architecture

### Composition

`src/server.ts` only loads dotenv and listens. `src/app.ts` (`buildApp()`) is the full composition root: CORS → plugins → route registration with prefixes. New modules must be imported and registered there with their URL prefix.

### Plugins (`src/plugins/`, all wrapped in `fastify-plugin`)

- `prisma.ts` — instantiates `PrismaClient` with the `@prisma/adapter-pg` driver adapter, decorates `app.prisma`, disconnects on close.
- `auth.ts` — decorates `app.authenticate`: verifies the JWT (read from the `token` httpOnly cookie via `@fastify/cookie`) or replies 401.
- `authorization.ts` — decorates `app.authorize(roles)` and `app.authorizeClient`. **Currently declared but not used by any route** — every module today applies only `app.authenticate`. Use these when adding role-gated endpoints rather than hand-rolling role checks.

Decorator types live in `src/types/fastify.d.ts` (`prisma`, `authenticate`) and inline in `authorization.ts` (`authorize`, `authorizeClient`).

### Module layout (`src/modules/<name>/`)

Four files per module, strictly layered:

- `*.routes.ts` — default-exports `function (app: FastifyInstance)`. First line is almost always `app.addHook('preHandler', app.authenticate)` to protect the whole module (`auth` is the exception — it protects per-route). **Static paths must be declared before `/:id`** (e.g. `/active`, `/low-stock`, `/date-range`).
- `*.controller.ts` — named exports ending in `Controller`. Parses `req.body` / `req.params` / `req.query` with the Zod schemas, calls the service via `req.server.prisma`, sets status codes. Services returning `null` map to 404; creates return 201; deletes return 204.
- `*.service.ts` — plain exported functions whose first parameter is `prisma: FastifyInstance['prisma']`. No Fastify types beyond that; all Prisma access lives here.
- `*.schema.ts` — Zod schemas plus `z.infer` DTO exports. Update schemas derive from create schemas (`createXSchema.partial()`).

Existing modules: `auth`, `users`, `clients`, `pets`, `medical-records`, `consultations`, `visits`, `vaccination`, `medications`, `inventory`.

### Conventions that matter

- **Soft deletes.** Entities carry `isActive`; delete endpoints flip the flag. Read queries must filter `where: { isActive: true }`, and update/delete services first `findFirst` on the active row and return `null` when missing so the controller can 404.
- **Prisma types are imported from the generated client**, not `@prisma/client`: `import type { Prisma } from '../../generated/prisma/client'`. `src/generated/prisma` is gitignored — run `pnpm db:generate` before typechecking on a fresh clone.
- **Pagination** — list endpoints that paginate take `page`/`limit` via `z.coerce.number()` with defaults (1 / 10, max 100) and return `{ data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }`.
- **Validation is done inside controllers** with `schema.parse(...)`; Fastify route-level JSON schemas are not used, and there is no custom error handler, so a Zod failure surfaces as a generic 500.
- **Auth session shape** is `sessionSchema` in `auth.schema.ts` (`{ id, role, clientId?, iat }`); parse `req.user` through it instead of casting.
- Style: no semicolons, single quotes (Prettier via VS Code settings). ESLint enforces `no-console` (warn), `require-await`, and `import type` for type-only imports; `_`-prefixed identifiers are exempt from unused-vars.
- User-facing response messages are in Spanish; code, identifiers, and most comments are in English.

## Deployment

`.github/workflows/deploy.yml`: every push/PR to `main` runs generate → typecheck → lint → build. Pushes to `main` additionally SCP `dist/` to a DigitalOcean box, `git pull`, `pnpm install --frozen-lockfile`, `pnpm db:migrate`, then `pm2 restart ecosystem.config.cjs --env production`. Migrations therefore run automatically on deploy — a schema change merged to `main` hits production DB immediately.

CORS origins are hardcoded in `src/app.ts` (`http://localhost:5173`, `https://app.ponyvet.com`); a new frontend origin must be added there.
