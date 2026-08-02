# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a **Bruno API collection** (`bruno.json`, collection name `ponyapp`) — not an application codebase. It contains no source code, build system, or test runner. Every file is a `.bru` request definition, an environment file, or a `folder.bru` describing a folder's shared settings. The collection documents the HTTP API for **ponyapp**, a veterinary practice management backend (clients, medical records, consultations, medications, vaccinations, inventory, users).

There is no build, lint, or test command for this repo. "Testing" a request means opening it in the Bruno app (or `bru` CLI, if installed) and running it against a live backend.

## Environments

Two environments live in `environments/`:
- `local.bru` — `baseUrl: http://127.0.0.1:3000`.
- `local network.bru` — `baseUrl: http://192.168.1.110:3000` (LAN access, e.g. testing from a phone/device on the same network).

The backend server itself is **not** part of this repo — it must be running separately (locally or on the LAN host above) for requests to succeed.

## Auth model

- The backend uses [Better Auth](https://better-auth.com), mounted as a catch-all at `/api/auth/*`. There is no `/auth` module — auth is cookie-based, not bearer-token. `POST /api/auth/sign-in/email` sets an httpOnly `better-auth.session_token` cookie; every request's method block uses `auth: none` (or `auth: inherit`, which resolves to the same thing since no auth is set at the collection root).
- Every `folder.bru` carries a `script:pre-request` block that auto-logs-in: it checks `bru.cookies.jar().hasCookie(baseUrl, "better-auth.session_token")`, and if missing, runs `auth/Login` via `bru.runRequest("auth/Login")` before the actual request fires. The guard `!req.getUrl().endsWith("/api/auth/sign-in/email")` prevents the Login request itself from re-triggering the script recursively. This requires Bruno's cookie jar to be enabled (Settings → General → Cookies — on by default) so the `Set-Cookie` from login persists and gets replayed automatically.
- `Login.bru` (request name `Login`, hits `/api/auth/sign-in/email`) uses the credentials hardcoded in its `body:json` (`vladimir@ponyvet.com` / `password123`) — update those if the seeded admin credentials change. The request name stays `Login` even though the endpoint changed, since every `folder.bru` script references it by name via `bru.runRequest("auth/Login")`.
- `auth/Logout.bru` hits `POST /api/auth/sign-out` and `auth/Get session.bru` hits `GET /api/auth/get-session` (replaces the old `POST /auth/profile`; the response shape is now `{ session, user }`, or `null` if there's no active session — `user` no longer includes the joined `client` relation, only `clientId`).
- **Any cookie-authenticated request to `/api/auth/*` that isn't a plain `GET` requires an `Origin` header matching one of the backend's `trustedOrigins`** (`http://localhost:5173` in dev) — this is Better Auth's CSRF protection, and unlike a real browser, Bruno/curl won't add it automatically. `Logout.bru` sets this explicitly via a `headers` block; add the same header to any new state-changing request under `/api/auth/*` (endpoints outside `/api/auth/*`, like the rest of this collection, aren't affected — that check only applies to Better Auth's own routes).
- There is no `token` environment variable anymore — don't reintroduce a bearer-token pattern when adding new requests; follow the cookie + auto-login pattern above instead.

## Collection conventions

When adding or editing a request, follow the existing pattern exactly — every request in every folder conforms to this shape:

1. **`meta` block**: `name`, `type: http`, and `seq` (sequence number controlling display order within the folder — increment from the last existing `seq` in that folder).
2. **Method block** (`get`/`post`/`put`/`patch`/`delete`): `url: {{baseUrl}}/...`, `body: json|none`, `auth: none` (the folder's pre-request script handles login via cookie — see Auth model above).
3. **`body:json`** for write requests, with realistic example payloads (Spanish-language sample data is used throughout, e.g. `"Vacuna anual para felinos"`, `"Uso en consulta"` — keep new examples consistent with this).
4. **`params:query`** block for requests taking query params (e.g. date-range endpoints use ISO 8601 `startDate`/`endDate`).
5. **`tests` block**: every request includes exactly two Chai/Bruno assertions —
   ```js
   test("Should return 401 without token", function() {
     expect(res.getStatus()).to.equal(401);
   });
   test("Should return success with valid token", function() {
     expect(res.getStatus()).to.be.oneOf([200, 201]);
   });
   ```
   Reproduce both tests on new requests unless the endpoint's actual auth/status behavior differs (match what the endpoint really returns rather than copying blindly).

Path-parameterized requests (get/update/delete single resource) use placeholder IDs in the URL (e.g. `medication-id-example`, `record-id-example`) rather than a real ID — `clients/` is the one folder that instead hardcodes a real-looking UUID across its single-resource requests. Follow whichever convention the target folder already uses.

## Folder/domain map

Each top-level folder is one resource domain, generally offering list/get/create/update/delete plus a few domain-specific endpoints:

- `auth/` — login, logout, get session (Better Auth catch-all endpoints).
- `clients/` — pet owner CRUD.
- `medical-records/` — records CRUD, plus list-by-client.
- `consultations/` — visit CRUD, plus list-by-medical-record and list-by-date-range.
- `medications/` — medication catalog CRUD, plus list-active and list-by-category (categories like `VACCINE`, species like `CAT`).
- `vaccinations/` — applied vaccinations CRUD, plus list-by-medical-record, list-by-date-range, and list-upcoming.
- `inventory/` — stock item CRUD, plus adjust-quantity, stats, expiring-soon, low-stock.
- `users/` — staff/user account CRUD.

When adding a new endpoint, place it in the matching domain folder and update that folder's `seq` numbering accordingly.
