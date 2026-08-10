/**
 * Public barrel export for @trutravel/domain (TKT-010).
 *
 * Organized by module boundary (docs/architecture/platform-architecture.md §3). Consumers —
 * apps/web's API routes today, T2/T3's future builds — should import from "@trutravel/domain",
 * not reach into src/<module>/<file> directly. This file IS the contract surface; treat adding or
 * removing an export here as the same kind of visible, reviewable change as a public API change.
 */

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------
export { isAgeGatePassed, assertAgeGatePassed, AgeGateFailedError } from "./identity/age-gate";
export {
  ConsoleOtpProvider,
  type OtpProvider,
} from "./identity/otp-provider";

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------
export {
  assertSubLocationAllowed,
  deriveAltitudeTier,
  assertThrillingTripPublishable,
  PARVATI_LEGAL_BLOCK_TRIPPY,
} from "./catalog/policy";
export { CatalogPolicyViolation } from "./catalog/errors";

// ---------------------------------------------------------------------------
// Matching (P3's TKT-008 rubric)
// ---------------------------------------------------------------------------
export { THRILLING_TAGS, TRIPPY_TAGS, ordinalTier, tierPoints, type MatchTier } from "./matching/tags";
export type {
  TagKey,
  HardOrSoft,
  TagDefinition,
  HardGateResult,
  ThrillingTravelerTags,
  ThrillingTripRequirements,
  TrippyTravelerTags,
  TrippyTripRequirements,
  DepartureEligibilityContext,
  ThrillingHardGateContext,
  TrippyHardGateContext,
} from "./matching/types";
export { evaluateThrillingHardGates, evaluateTrippyHardGates } from "./matching/hard-gates";
export {
  scoreThrillingMatch,
  scoreTrippyMatch,
  loyaltyBand,
  type SoftScoreResult,
  type DimensionScoreBreakdown,
} from "./matching/soft-score";
export {
  computeCompositionPreview,
  type CompositionPreview,
  type CompositionPreviewTagSummary,
} from "./matching/composition-preview";
export { assertValidOverride, InvalidOverrideError, type OverrideInput } from "./matching/overrides";

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------
export {
  DEPARTURE_TRANSITIONS,
  SEAT_TRANSITIONS,
  assertDepartureTransition,
  assertSeatTransition,
  InvalidStateTransitionError,
} from "./booking/state-machine";
export {
  REFUND_POLICY_BY_SEGMENT,
  resolveRefund,
  RefundPolicyNotConfiguredError,
  type RefundPolicy,
  type CancellationInput,
  type RefundOutcome,
} from "./booking/refund-policy";
export {
  evaluateThrillingGroupBooking,
  evaluateTrippyGroupBooking,
  allSeatsEligible,
  type GroupSeatRequest,
  type GroupSeatEvaluation,
} from "./booking/group-booking";

// ---------------------------------------------------------------------------
// Events — TYPE-ONLY contract for T3. No emission logic exists in this package or apps/web.
// ---------------------------------------------------------------------------
export type { TruTravelEvent } from "./events/event-catalog";
