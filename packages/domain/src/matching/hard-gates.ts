import type { SubLocation } from "@trutravel/db";
import type {
  HardGateResult,
  ThrillingHardGateContext,
  TrippyHardGateContext,
} from "./types";
import { ordinalTier } from "./tags";
import { assertSubLocationAllowed } from "../catalog/policy";
import { CatalogPolicyViolation } from "../catalog/errors";

const SKILL_LEVEL_ORDER = ["beginner", "intermediate", "advanced", "expert"] as const;
const FITNESS_LEVEL_ORDER = ["low", "moderate", "high", "athlete"] as const;

function meetsOrdinalMinimum(order: readonly string[], value: string, minimum: string): boolean {
  return order.indexOf(value) >= order.indexOf(minimum);
}

function thrillingSubLocationClears(subLocation: SubLocation): boolean {
  try {
    // Reuses the single source of truth for catalog scope (see catalog/policy.ts) rather than
    // duplicating an allow-list here.
    assertSubLocationAllowed("thrilling_tours", subLocation);
    return true;
  } catch (err) {
    if (err instanceof CatalogPolicyViolation) return false;
    throw err;
  }
}

/**
 * Hard gates, evaluated in matching-v0 §2.1's stated order, fail-fast (not scored-then-filtered).
 * Every rejection carries a plain-language reason (matching-v0 §2: "explainable" requirement).
 *
 * Gate 3 (altitude_tier = standard) is a catalog-level/build-time gate per matching-v0 §1.3 — every
 * live September Trip is `standard` by construction (enforced at publish time, see
 * catalog/policy.ts assertThrillingTripPublishable), so it is NOT re-checked per-traveler here.
 * Gate 9 (activity_type) is structurally satisfied by having selected this Trip template to begin
 * with — also not a runtime check in this function, per matching-v0 §2.1.9.
 */
export function evaluateThrillingHardGates(ctx: ThrillingHardGateContext): HardGateResult {
  // Gate 2: sub_location scope
  if (!thrillingSubLocationClears(ctx.subLocation)) {
    return {
      passed: false,
      failedGateKey: "sub_location",
      reason: "This trip's location is not in the current Thrilling catalog scope.",
    };
  }

  // Gate 4: platform-wide 18+ gate (not re-derived here — read from the already-computed signup-time flag)
  if (!ctx.ageGatePassed) {
    return {
      passed: false,
      failedGateKey: "age_gate",
      reason: "You must be 18 or older to book on TruTravel.",
    };
  }

  // Gate 5: departure eligibility
  if (!["open", "filling"].includes(ctx.departure.state)) {
    return {
      passed: false,
      failedGateKey: "departure_state",
      reason: "This departure is no longer open for booking.",
    };
  }
  if (ctx.departure.seatCapacityRemaining <= 0) {
    return {
      passed: false,
      failedGateKey: "seat_capacity",
      reason: "This departure has no seats remaining.",
    };
  }

  // Gate 6: skill_level
  if (!meetsOrdinalMinimum(SKILL_LEVEL_ORDER, ctx.traveler.skillLevel, ctx.trip.skillLevelMin)) {
    return {
      passed: false,
      failedGateKey: "skill_level",
      reason: `This trip requires ${ctx.trip.skillLevelMin} skill or higher — based on your profile, you're marked ${ctx.traveler.skillLevel}.`,
    };
  }

  // Gate 7: fitness_level — only enforced for SKUs flagged physically demanding
  if (ctx.trip.fitnessLevelMin) {
    if (!meetsOrdinalMinimum(FITNESS_LEVEL_ORDER, ctx.traveler.fitnessLevel, ctx.trip.fitnessLevelMin)) {
      return {
        passed: false,
        failedGateKey: "fitness_level",
        reason: `This trip requires ${ctx.trip.fitnessLevelMin} fitness or higher — based on your profile, you're marked ${ctx.traveler.fitnessLevel}.`,
      };
    }
  }

  // Gate 8: certification_held — only hard where the SKU requires it (matching-v0 §2.1.8)
  if (ctx.trip.requiresCertification) {
    if (ctx.traveler.certificationHeld === "none") {
      return {
        passed: false,
        failedGateKey: "certification_held",
        reason: `This trip requires proof of certification (${ctx.trip.certificationRequired ?? "activity-specific"}) — none is on file for your profile.`,
      };
    }
  }

  return { passed: true };
}

/**
 * Trippy hard gates, matching-v0 §2.2 — notably, no skill/fitness/certification gates exist for
 * Trippy at all (§2.2.5). Do not add one here to "solve" pressure-mismatch risk with a hard gate —
 * that mitigation is people/policy (Trippy PRD §6), not a matching constraint (matching-v0 §6).
 */
export function evaluateTrippyHardGates(ctx: TrippyHardGateContext): HardGateResult {
  // Gate 2: sub_location — kasol_parvati is structurally hard-blocked (see catalog/policy.ts)
  try {
    assertSubLocationAllowed("trippy_tours", ctx.subLocation);
  } catch (err) {
    if (err instanceof CatalogPolicyViolation) {
      return {
        passed: false,
        failedGateKey: "sub_location",
        reason: "This location is not available for Trippy Tours.",
      };
    }
    throw err;
  }

  // Gate 3: platform-wide 18+ gate
  if (!ctx.ageGatePassed) {
    return {
      passed: false,
      failedGateKey: "age_gate",
      reason: "You must be 18 or older to book on TruTravel.",
    };
  }

  // Gate 4: departure eligibility
  if (!["open", "filling"].includes(ctx.departure.state)) {
    return {
      passed: false,
      failedGateKey: "departure_state",
      reason: "This departure is no longer open for booking.",
    };
  }
  if (ctx.departure.seatCapacityRemaining <= 0) {
    return {
      passed: false,
      failedGateKey: "seat_capacity",
      reason: "This departure has no seats remaining.",
    };
  }

  return { passed: true };
}

// Exported for the ordinal-tier utilities elsewhere in the matching module (soft-score.ts).
export { SKILL_LEVEL_ORDER, FITNESS_LEVEL_ORDER, ordinalTier };
