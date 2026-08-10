import type { TagDefinition } from "./types";

/**
 * Tag vocabulary — transcribed from matching-v0 §1 (P3, TKT-008), not re-derived.
 *
 * Segment-namespaced per P3's explicit instruction (§1.3): "do not build one shared global tag
 * dictionary" — Trippy's `noise_energy` (social/expressive energy) must never collide with a
 * future Wellness definition (ambient quiet/silence tolerance) or any other segment's tag.
 *
 * `substance_stance` is absent from THRILLING_TAGS and TRIPPY_TAGS below — not because it was
 * filtered out, but because it was never entered. See TrippyTravelerProfile in
 * packages/db/prisma/schema.prisma and platform-architecture.md §6.1 for the explicit audit.
 */

export const THRILLING_TAGS: readonly TagDefinition[] = [
  { key: "thrilling_tours.segment", hardOrSoft: "hard", scoredInSoftRubric: false },
  { key: "thrilling_tours.activity_type", hardOrSoft: "hard", scoredInSoftRubric: false },
  {
    key: "thrilling_tours.skill_level",
    order: ["beginner", "intermediate", "advanced", "expert"],
    hardOrSoft: "hard",
    scoredInSoftRubric: true, // hard-gated at the band boundary; scored for within-band closeness (matching-v0 §3.1)
  },
  {
    key: "thrilling_tours.fitness_level",
    order: ["low", "moderate", "high", "athlete"],
    hardOrSoft: "hard", // hard only for physically-demanding SKUs, matching-v0 §2.1.7
    scoredInSoftRubric: true,
  },
  {
    key: "thrilling_tours.risk_appetite",
    order: ["cautious", "moderate", "high"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true, // #1-weighted dimension (35 pts), matching-v0 §3.1
  },
  {
    key: "thrilling_tours.certification_held",
    order: ["none", "basic", "advanced", "professional"],
    hardOrSoft: "soft", // hard only where a specific SKU requires it (matching-v0 §2.1.8)
    scoredInSoftRubric: false, // informational once past the hard-gate threshold (matching-v0 §3.1)
  },
  {
    key: "thrilling_tours.gear_ownership",
    order: ["none", "partial", "full"],
    hardOrSoft: "soft",
    scoredInSoftRubric: false, // operator gear-rental logistics input only, never compatibility scoring
  },
  {
    key: "thrilling_tours.loyalty_trips_count",
    hardOrSoft: "soft",
    scoredInSoftRubric: true, // banded (0 / 1-3 / 4+), matching-v0 §3.1
  },
] as const;

export const TRIPPY_TAGS: readonly TagDefinition[] = [
  { key: "trippy_tours.segment", hardOrSoft: "hard", scoredInSoftRubric: false },
  {
    key: "trippy_tours.pace_preference",
    order: ["unplanned", "loosely_planned", "structured"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true, // #1-weighted dimension (30 pts), matching-v0 §3.2
  },
  {
    key: "trippy_tours.group_size_pref",
    order: ["micro_4_6", "standard_8_12", "large_12_plus"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true,
  },
  {
    key: "trippy_tours.noise_energy",
    order: ["chill", "moderate", "high_energy"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true,
  },
  {
    key: "trippy_tours.spiritual_openness",
    order: ["none", "curious", "practicing"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true, // deliberately lower-weighted (15 pts) — diversity here is expected, not suppressed
  },
  {
    key: "trippy_tours.photography_comfort",
    order: ["private", "ask_first", "open"],
    hardOrSoft: "soft",
    scoredInSoftRubric: true,
  },
  {
    key: "trippy_tours.loyalty_trips_count",
    hardOrSoft: "soft",
    scoredInSoftRubric: false, // informational only for Trippy (matching-v0 §3.2) — unlike Thrilling
  },
  // Explicitly absent: trippy_tours.substance_stance. Do not add. See file header + Trippy PRD §6.
] as const;

/** Ordinal tiering used identically across every ordinal tag (matching-v0 §3). */
export type MatchTier = "exact" | "adjacent" | "distant";

export function ordinalTier(order: readonly string[], a: string, b: string): MatchTier {
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  if (ia === -1 || ib === -1) {
    throw new Error(`Value not found in ordinal scale: "${ia === -1 ? a : b}"`);
  }
  const distance = Math.abs(ia - ib);
  if (distance === 0) return "exact";
  if (distance === 1) return "adjacent";
  return "distant";
}

export function tierPoints(tier: MatchTier): number {
  switch (tier) {
    case "exact":
      return 1;
    case "adjacent":
      return 0.5;
    case "distant":
      return 0;
  }
}
