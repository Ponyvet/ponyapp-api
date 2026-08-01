# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a **Bruno API collection** (`bruno.json`, collection name `ponyapp`) — not an application codebase. It contains no source code, build system, or test runner. Every file is a `.bru` request definition, an environment file, or a `folder.bru` describing a folder's shared settings. The collection documents the HTTP API for **ponyapp**, a veterinary practice management backend (clients, medical records, consultations, medications, vaccinations, inventory, users).

There is no build, lint, or test command for this repo. "Testing" a request means opening it in the Bruno app (or `bru` CLI, if installed) and running it against a live backend.

## Environments

Two environments live in `environments/`:
- `local.bru` — `baseUrl: http://localhost:3000`, plus an empty `token` var populated after login.
- `local network.bru` — `baseUrl: http://192.168.1.110:3000` (LAN access, e.g. testing from a phone/device on the same network).

The backend server itself is **not** part of this repo — it must be running separately (locally or on the LAN host above) for requests to succeed.

## Auth model

- Login via `auth/Login.bru` (`POST /auth/login` with `email`/`password`) returns a token that must be copied into the environment's `token` variable — there is no pre-request script that does this automatically.
- Folders that require authentication set `auth { mode: inherit }` in their `folder.bru` (e.g. `auth/`, `clients/`) and individual requests use `auth: bearer` with `auth:bearer { token: {{token}} }` referencing the environment var.
- `auth/Logout.bru` and `auth/Profile data.bru` round out the auth folder.

## Collection conventions

When adding or editing a request, follow the existing pattern exactly — every request in every folder conforms to this shape:

1. **`meta` block**: `name`, `type: http`, and `seq` (sequence number controlling display order within the folder — increment from the last existing `seq` in that folder).
2. **Method block** (`get`/`post`/`put`/`patch`/`delete`): `url: {{baseUrl}}/...`, `body: json|none`, `auth: bearer`.
3. **`auth:bearer` block**: always `token: {{token}}`.
4. **`body:json`** for write requests, with realistic example payloads (Spanish-language sample data is used throughout, e.g. `"Vacuna anual para felinos"`, `"Uso en consulta"` — keep new examples consistent with this).
5. **`params:query`** block for requests taking query params (e.g. date-range endpoints use ISO 8601 `startDate`/`endDate`).
6. **`tests` block**: every request includes exactly two Chai/Bruno assertions —
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

- `auth/` — login, logout, profile.
- `clients/` — pet owner CRUD.
- `medical-records/` — records CRUD, plus list-by-client.
- `consultations/` — visit CRUD, plus list-by-medical-record and list-by-date-range.
- `medications/` — medication catalog CRUD, plus list-active and list-by-category (categories like `VACCINE`, species like `CAT`).
- `vaccinations/` — applied vaccinations CRUD, plus list-by-medical-record, list-by-date-range, and list-upcoming.
- `inventory/` — stock item CRUD, plus adjust-quantity, stats, expiring-soon, low-stock.
- `users/` — staff/user account CRUD.

When adding a new endpoint, place it in the matching domain folder and update that folder's `seq` numbering accordingly.
