# @trutravel/db

Prisma schema + client for the TruTravel platform (Himachal x Thrilling / Trippy slice).

## Setup

1. Set `DATABASE_URL` (Postgres) in a `.env` file at the repo root or in this package.
2. Install dependencies at the repo root: `npm install`.
3. Generate the Prisma client: `npm run db:generate` (from repo root) or `npm run generate`
   (from this package).
4. Create the base schema: `npm run db:migrate` (from repo root) or `npm run migrate:dev`
   (from this package).
5. **Required — apply the hard constraints file:** `prisma/sql/hard_constraints.sql` is not
   picked up by `prisma migrate dev` automatically (Prisma's schema DSL doesn't support arbitrary
   `CHECK` constraints). Apply it explicitly after every fresh migration:

   ```
   npx prisma db execute --file prisma/sql/hard_constraints.sql --schema prisma/schema.prisma
   ```

   This is not optional — it's the database-level enforcement of the Trippy/Kasol-Parvati legal
   exclusion (see `docs/architecture/platform-architecture.md` §5). **T4: this step must be folded
   into the CI/migration pipeline so it can never be silently skipped in any environment.**
6. Seed fixture data: `npm run db:seed` (from repo root) or `npm run seed` (from this package).

## Notes for T2 / T5

- `Seat.depositAmountINR` / `balanceAmountINR` / `totalAmountINR` are nullable by design — this
  package does not populate them with real numbers. See `packages/domain/src/booking/refund-policy.ts`.
- `PartnerSegmentTier` is unique per `(partnerId, segment)` — an operator's tier never carries across
  segments. Query accordingly.
