import type { AltitudeTier, SegmentKey, SubLocation } from "@trutravel/db";
import { CatalogPolicyViolation } from "./errors";

/**
 * Catalog scope / structural exclusion policy.
 *
 * Two mechanisms, deliberately different in kind, mirroring the distinction both PRDs draw
 * explicitly (see docs/architecture/platform-architecture.md §5 for the full rationale):
 *
 *  1. Trippy x kasol_parvati — a founder/legal exclusion (NDPS Act abetment-exposure concern,
 *     Trippy PRD §2, risk-register §4). This is NOT a config toggle. `PARVATI_LEGAL_BLOCK_TRIPPY`
 *     exists so the block is visible and named, but flipping it is not how this gets lifted — the
 *     only legitimate path is the founder+legal review both PRDs describe. This is mirrored at the
 *     database layer (prisma/sql/hard_constraints.sql) so an application-code bug cannot bypass it.
 *
 *  2. Thrilling's Manali/Bir-only Sept catalog scope — a supply/ops decision (Thrilling PRD §2:
 *     "not for a hard reason... flag back to P1 if cheap supply exists"). Modeled as a plain
 *     allow-list so G2/P1 can extend it without a code change or migration, unlike (1).
 */

// Only the legitimate lift path is a founder+legal decision (Trippy PRD §2, risk-register §4/§10).
// Do not flip this as a routine config change.
export const PARVATI_LEGAL_BLOCK_TRIPPY = true;

const TRIPPY_LIVE_SUBLOCATIONS: readonly SubLocation[] = ["manali", "bir"];

// Thrilling's current Sept catalog scope (Thrilling PRD §2, §10). Kasol/Tosh is deliberately
// absent here for scope-tightening reasons, not a legal block — extend this list, don't add a DB
// constraint, if G2/P1 confirm cheap Thrilling-only supply there.
const THRILLING_LIVE_SUBLOCATIONS: readonly SubLocation[] = ["manali", "bir"];

const SEGMENTS_WITH_LIVE_CATALOG: readonly SegmentKey[] = ["thrilling_tours", "trippy_tours"];

export function assertSubLocationAllowed(segment: SegmentKey, subLocation: SubLocation): void {
  if (!SEGMENTS_WITH_LIVE_CATALOG.includes(segment)) {
    throw new CatalogPolicyViolation(
      `Segment "${segment}" has no live PRD yet — Trip creation is not enabled for it in this slice.`
    );
  }

  if (segment === "trippy_tours") {
    if (subLocation === "kasol_parvati") {
      if (PARVATI_LEGAL_BLOCK_TRIPPY) {
        throw new CatalogPolicyViolation(
          "Trippy Tours may not be created with sub_location=kasol_parvati. This is a founder/legal " +
            "exclusion (Trippy PRD §2, risk-register §4 — NDPS Act abetment-exposure concern, pending " +
            "a legal review that has not been commissioned), not a catalog-availability gap. It cannot " +
            "be lifted by editing catalog config — see PARVATI_LEGAL_BLOCK_TRIPPY."
        );
      }
    }
    if (subLocation !== "kasol_parvati" && !TRIPPY_LIVE_SUBLOCATIONS.includes(subLocation)) {
      throw new CatalogPolicyViolation(
        `sub_location "${subLocation}" is not yet in Trippy's live catalog scope (Trippy PRD §2, §9).`
      );
    }
    return;
  }

  if (segment === "thrilling_tours") {
    if (!THRILLING_LIVE_SUBLOCATIONS.includes(subLocation)) {
      throw new CatalogPolicyViolation(
        `sub_location "${subLocation}" is not yet in Thrilling's September catalog scope ` +
          `(Thrilling PRD §2) — flag to P1/G2 if cheap Thrilling-only supply exists there before ` +
          `assuming this is a hard exclusion; unlike Trippy's Parvati block, this one is a supply/ops ` +
          "decision, not a legal one."
      );
    }
    return;
  }
}

/** Thrilling PRD §3: altitude_tier is derived from max_altitude_m, not separately declared. */
export function deriveAltitudeTier(maxAltitudeM: number): AltitudeTier {
  return maxAltitudeM >= 3000 ? "high_altitude" : "standard";
}

/**
 * Thrilling PRD §7 scope cut: only `standard` altitude_tier Trips may be published for the
 * September catalog — `high_altitude` is deferred pending G4's insurance-partner sourcing. This is
 * a time-bound launch-catalog policy (expected to lift), so it lives here as an application-layer
 * publish gate, not a DB CHECK constraint (contrast with the permanent Parvati block above).
 */
export function assertThrillingTripPublishable(maxAltitudeM: number): void {
  const tier = deriveAltitudeTier(maxAltitudeM);
  if (tier === "high_altitude") {
    throw new CatalogPolicyViolation(
      "high_altitude Thrilling Trips (max_altitude_m >= 3000) cannot be published for the September " +
        "catalog — deferred pending G4's insurance-partner sourcing (Thrilling PRD §7). This is a " +
        "fast-follow scope cut, not a permanent one; revisit this gate once G4/A4 clear it."
    );
  }
}
