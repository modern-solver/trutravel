import type { ThrillingTravelerTags, TrippyTravelerTags } from "./types";
import { ordinalTier, tierPoints, type MatchTier } from "./tags";
import { SKILL_LEVEL_ORDER, FITNESS_LEVEL_ORDER } from "./hard-gates";

/**
 * Soft-score rubric — matching-v0 §3. A traveler is scored against the LIVE GROUP PROFILE of the
 * Departure's currently-confirmed roster (the modal value per soft tag), not 1:1 against
 * individuals. Recomputed as the roster changes — callers should not cache this across bookings.
 *
 * Every score component maps to a plain-language explanation (matching-v0 §3: "no black-box
 * weighting" — there is no dimension here a user couldn't understand from its label). Not scored:
 * gear_ownership, non-hard-gate certification_held (Thrilling), and loyalty_trips_count (Trippy) —
 * these are Captain/Operator-facing informational fields only, per matching-v0 §3.1/§3.2.
 */

const RISK_APPETITE_ORDER = ["cautious", "moderate", "high"] as const;
const LOYALTY_BAND_ORDER = ["0", "1-3", "4+"] as const;
const PACE_PREFERENCE_ORDER = ["unplanned", "loosely_planned", "structured"] as const;
const GROUP_SIZE_PREF_ORDER = ["micro_4_6", "standard_8_12", "large_12_plus"] as const;
const NOISE_ENERGY_ORDER = ["chill", "moderate", "high_energy"] as const;
const SPIRITUAL_OPENNESS_ORDER = ["none", "curious", "practicing"] as const;
const PHOTOGRAPHY_COMFORT_ORDER = ["private", "ask_first", "open"] as const;

export function loyaltyBand(count: number): (typeof LOYALTY_BAND_ORDER)[number] {
  if (count <= 0) return "0";
  if (count <= 3) return "1-3";
  return "4+";
}

interface WeightedDimension<T> {
  key: string;
  weight: number;
  order: readonly string[];
  valueOf: (t: T) => string;
}

export interface DimensionScoreBreakdown {
  key: string;
  weight: number;
  travelerValue: string;
  groupModalValue: string;
  tier: MatchTier;
  pointsEarned: number; // weight * tierPoints(tier)
}

export interface SoftScoreResult {
  totalPoints: number; // out of 100
  breakdown: DimensionScoreBreakdown[];
}

function modalValue(order: readonly string[], values: readonly string[]): string {
  if (values.length === 0) {
    // No confirmed roster yet — nothing to compare against. Callers should treat this as
    // "not yet scoreable" (e.g. first seat on a brand-new Departure), not a zero score.
    throw new Error("Cannot compute group mode: confirmed roster is empty.");
  }
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = values[0]!;
  let bestCount = 0;
  for (const value of order) {
    const c = counts.get(value) ?? 0;
    if (c > bestCount) {
      bestCount = c;
      best = value;
    }
  }
  return best;
}

function scoreDimensions<T>(
  traveler: T,
  confirmedRoster: readonly T[],
  dimensions: readonly WeightedDimension<T>[]
): SoftScoreResult {
  const breakdown: DimensionScoreBreakdown[] = dimensions.map((dim) => {
    const rosterValues = confirmedRoster.map(dim.valueOf);
    const groupModalValue = modalValue(dim.order, rosterValues);
    const travelerValue = dim.valueOf(traveler);
    const tier = ordinalTier(dim.order, travelerValue, groupModalValue);
    return {
      key: dim.key,
      weight: dim.weight,
      travelerValue,
      groupModalValue,
      tier,
      pointsEarned: dim.weight * tierPoints(tier),
    };
  });
  const totalPoints = breakdown.reduce((sum, d) => sum + d.pointsEarned, 0);
  return { totalPoints, breakdown };
}

// --- Thrilling: 100 pts (matching-v0 §3.1) ---

const THRILLING_DIMENSIONS: readonly WeightedDimension<ThrillingTravelerTags>[] = [
  { key: "risk_appetite", weight: 35, order: RISK_APPETITE_ORDER, valueOf: (t) => t.riskAppetite },
  { key: "skill_level", weight: 25, order: SKILL_LEVEL_ORDER, valueOf: (t) => t.skillLevel },
  {
    key: "loyalty_trips_count",
    weight: 20,
    order: LOYALTY_BAND_ORDER,
    valueOf: (t) => loyaltyBand(t.loyaltyTripsCount),
  },
  { key: "fitness_level", weight: 20, order: FITNESS_LEVEL_ORDER, valueOf: (t) => t.fitnessLevel },
];

export function scoreThrillingMatch(
  traveler: ThrillingTravelerTags,
  confirmedRoster: readonly ThrillingTravelerTags[]
): SoftScoreResult {
  return scoreDimensions(traveler, confirmedRoster, THRILLING_DIMENSIONS);
}

// --- Trippy: 100 pts (matching-v0 §3.2) ---

const TRIPPY_DIMENSIONS: readonly WeightedDimension<TrippyTravelerTags>[] = [
  { key: "pace_preference", weight: 30, order: PACE_PREFERENCE_ORDER, valueOf: (t) => t.pacePreference },
  { key: "noise_energy", weight: 25, order: NOISE_ENERGY_ORDER, valueOf: (t) => t.noiseEnergy },
  { key: "group_size_pref", weight: 20, order: GROUP_SIZE_PREF_ORDER, valueOf: (t) => t.groupSizePref },
  {
    key: "spiritual_openness",
    weight: 15, // deliberately lower — diversity here is expected, not suppressed (matching-v0 §4.2)
    order: SPIRITUAL_OPENNESS_ORDER,
    valueOf: (t) => t.spiritualOpenness,
  },
  {
    key: "photography_comfort",
    weight: 10,
    order: PHOTOGRAPHY_COMFORT_ORDER,
    valueOf: (t) => t.photographyComfort,
  },
];

export function scoreTrippyMatch(
  traveler: TrippyTravelerTags,
  confirmedRoster: readonly TrippyTravelerTags[]
): SoftScoreResult {
  return scoreDimensions(traveler, confirmedRoster, TRIPPY_DIMENSIONS);
}
