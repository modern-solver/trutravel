# TruTravel — Himachal × Thrilling / Trippy vertical slice (TKT-010)

Modular-monolith monorepo: Next.js 14 App Router web app + two framework-free TypeScript packages
(domain logic, DB/Prisma layer). Full architecture rationale: `docs/architecture/platform-architecture.md`.

```
apps/web/            Next.js app — pages + API route handlers (the vertical slice's HTTP surface)
packages/domain/      Framework-free domain logic: identity, catalog policy, matching (P3's rubric),
                       booking state machine, event contract. No DB or HTTP dependencies.
packages/db/          Prisma schema, client singleton, seed data, hard DB-level constraints.
```

## Setup

1. `npm install` from the repo root (npm workspaces — installs all three packages together).
2. Copy `.env.example` to `.env` and set `DATABASE_URL` (Postgres) and, for anything beyond local
   dev, `SESSION_SECRET` (see "Auth" below — there is a loud, insecure dev fallback if unset).
3. `npm run db:generate` — generates the Prisma client.
4. `npm run db:migrate` — creates the base schema from `packages/db/prisma/schema.prisma`.
5. **Required, not optional:** apply the hard DB constraints file —
   `npx prisma db execute --file packages/db/prisma/sql/hard_constraints.sql --schema packages/db/prisma/schema.prisma`.
   This is Prisma-schema-DSL-incompatible `CHECK` enforcement for the Trippy/Kasol-Parvati legal
   exclusion (`docs/architecture/platform-architecture.md` §5). **T4: fold this into the CI/migration
   pipeline** — see `packages/db/README.md`.
6. `npm run db:seed` — loads fixture data (6 segments, 1 corridor, 2 partners, 1 Thrilling + 1
   Trippy Trip with an Open Departure).
7. `npm run dev` — starts `apps/web` on `http://localhost:3000`.

## Auth (what's real vs. stubbed)

- Session cookies are real, working HMAC-signed tokens (`apps/web/lib/session.ts`), not a
  placeholder — but there is no production secret management, rotation, or revocation. Set
  `SESSION_SECRET` yourself for anything beyond local dev; T4 owns real secret management.
- OTP is a **dev-only stub** (`packages/domain/src/identity/otp-provider.ts`'s `ConsoleOtpProvider`,
  wired as a singleton in `apps/web/lib/otp.ts`): it logs the OTP code to the server console instead
  of sending a real SMS. T4 owns wiring a real vendor + rate limiting.
- The platform-wide 18+ age gate (`packages/domain/src/identity/age-gate.ts`) is real and enforced
  at `POST /api/auth/signup` — a user who fails it never gets a User row created.

## API surface (this vertical slice)

See `docs/architecture/platform-architecture.md` §10 for the full table. Every route is wired to
the real Prisma DB layer and the real domain logic (hard gates, catalog policy, composition
preview) — nothing under `apps/web/app/api/` is a mock/placeholder handler.

## What's out of scope here

Payment capture, refund execution, analytics emission, CI/deploy, and React implementation of
P2's key-screens are explicitly not built in this ticket — see
`docs/architecture/platform-architecture.md` §11/§12 for the full handoff to T2/T3/T4/T5.
