import type { SegmentKey, SubLocation, DepartureState } from "@trutravel/db";

/** Segment-namespaced tag key, per matching-v0 §1.3 — never a shared/global tag dictionary. */
export type TagKey = `${SegmentKey}.${string}`;

export type HardOrSoft = "hard" | "soft";

export interface TagDefinition {
  key: TagKey;
  /** Ordered ordinal values (index 0 = "lowest"), used for adjacent/distant soft-score tiering.
   *  Absent for non-ordinal tags (none remain in-scope at v0 per matching-v0 §3). */
  order?: readonly string[];
  hardOrSoft: HardOrSoft;
  /** true only for tags matching-v0 explicitly excludes from soft-score (informational-only). */
  scoredInSoftRubric: boolean;
}

export interface HardGateResult {
  passed: boolean;
  /** Which gate failed, in matching-v0 §2's stated evaluation order. Absent if passed. */
  failedGateKey?: string;
  /** Plain-language, user-facing reason (matching-v0 §2: every rejection is explainable). */
  reason?: string;
}

export interface ThrillingTravelerTags {
  skillLevel: string;
  fitnessLevel: string;
  riskAppetite: string;
  certificationHeld: string;
  gearOwnership: string;
  loyaltyTripsCount: number;
}

export interface ThrillingTripRequirements {
  skillLevelMin: string;
  fitnessLevelMin: string | null; // null => fitness gate not enforced for this SKU
  requiresCertification: boolean;
  certificationRequired: string | null;
}

export interface TrippyTravelerTags {
  pacePreference: string;
  groupSizePref: string;
  noiseEnergy: string;
  spiritualOpenness: string;
  photographyComfort: string;
  loyaltyTripsCount: number;
}

export interface TrippyTripRequirements {
  pacePreference: string;
  groupSizePref: string;
}

export interface DepartureEligibilityContext {
  state: DepartureState;
  seatCapacityRemaining: number;
}

export interface ThrillingHardGateContext {
  segment: "thrilling_tours";
  ageGatePassed: boolean;
  subLocation: SubLocation;
  departure: DepartureEligibilityContext;
  traveler: ThrillingTravelerTags;
  trip: ThrillingTripRequirements;
}

export interface TrippyHardGateContext {
  segment: "trippy_tours";
  ageGatePassed: boolean;
  subLocation: SubLocation;
  departure: DepartureEligibilityContext;
  traveler: TrippyTravelerTags;
  trip: TrippyTripRequirements;
}
