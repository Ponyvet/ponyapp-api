# Ponyapp API

REST API for a veterinary practice management system (Ponyvet). Built with Fastify 5, Prisma 7 (PostgreSQL), Zod 4, and TypeScript.

## Requirements

- Node.js
- pnpm
- PostgreSQL

## Local PostgreSQL setup (macOS)

Install and start PostgreSQL via Homebrew:

```bash
brew install postgresql@18
brew services start postgresql@18
```

Create a dedicated role and database for this project (don't reuse the default `postgres` superuser):

```bash
psql postgres -c "CREATE ROLE ponyapp WITH LOGIN PASSWORD 'change_me';"
psql postgres -c "CREATE DATABASE ponyapp OWNER ponyapp;"
```

Use those credentials in `DATABASE_URL` (see [Setup](#setup) below):

```
DATABASE_URL="postgresql://ponyapp:change_me@localhost:5432/ponyapp"
```

## Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, PORT, SEED_ADMIN_*
pnpm db:generate
pnpm db:migrate:dev
pnpm dev                # on first boot, creates the initial ADMIN user from SEED_ADMIN_* env vars
```

## Development

```bash
pnpm dev                # start the dev server (tsx watch)
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint
```

## Build & run

```bash
pnpm build
pnpm start
```

## Database

```bash
pnpm db:generate        # regenerate the Prisma client (run after any schema.prisma change)
pnpm db:migrate:dev     # create and apply a migration locally
pnpm db:migrate         # deploy migrations (production)
```

## Documentation

`docs/PROYECT.md` is the authoritative data-model spec (entities, fields, business rules). See `CLAUDE.md` for architecture and conventions.
