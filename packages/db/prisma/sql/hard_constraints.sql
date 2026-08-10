-- TruTravel — hard database-level constraints that must not depend on application code alone.
--
-- Prisma's schema.prisma DSL does not support arbitrary CHECK constraints, so these ship as a
-- companion raw-SQL step, run immediately after `prisma migrate dev` / `prisma db push` creates
-- the base tables from schema.prisma. See packages/db/README.md for the run order.
--
-- T4: fold this file into the CI/migration pipeline so it is never a manual, skippable step in any
-- environment (local dev, staging, prod). This is not optional hardening — it is the enforcement
-- mechanism for a founder-level legal-risk decision (Trippy PRD §2, risk-register §4).

-- Trippy Tours may never be created with sub_location = kasol_parvati. This is a founder/legal
-- exclusion (NDPS Act abetment-exposure concern, pending a legal review that has not been
-- commissioned as of this ticket — Trippy PRD §2, risk-register §4/§10) — not a catalog-availability
-- gap, and not something that should be liftable by an ops config change. Compare with Thrilling's
-- Manali/Bir-only scope, which is intentionally NOT a DB constraint (see
-- packages/domain/src/catalog/policy.ts) because that exclusion is a supply/ops decision, not a
-- legal one, and the PRD explicitly invites revisiting it.
ALTER TABLE "Trip"
  ADD CONSTRAINT trip_trippy_no_parvati
  CHECK (NOT (segment = 'trippy_tours' AND "subLocation" = 'kasol_parvati'));

-- Belt-and-suspenders on the traveler side: no Trippy soft-score dimension should ever collapse to a
-- single free-text field wide enough to reconstruct a substance_stance-equivalent signal. There is
-- no such column in TrippyTravelerProfile to begin with (see schema.prisma), so there's nothing to
-- constrain here today — this comment exists so a future migration adding such a column is required
-- to touch this file and explain itself, not slip in quietly.
