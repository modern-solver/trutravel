/**
 * Manual, human, out-of-band hard-gate override — matching-v0 §5.2.
 *
 * "There is no algorithmic waiver mechanism." The ONLY path that admits a traveler who failed a
 * self-declared hard gate is an Anchor Operator or Captain making an explicit, logged, real-world
 * judgment call (e.g. a traveler has a relevant certification not yet in the tag taxonomy). This
 * must never be a silent schema bypass — every override is auditable (who, when, why) and feeds
 * T3's event taxonomy (see events/event-catalog.ts, `match_override_applied`).
 *
 * There is intentionally no function anywhere in this module that flips a Seat to `confirmed`
 * after a failed hard gate WITHOUT going through `recordOverride` below.
 */

export interface OverrideInput {
  seatId: string;
  departureId: string;
  overriddenByUserId: string; // must be an Operator staff or Captain, enforced by the caller/API layer
  gateFailed: string; // matches HardGateResult.failedGateKey
  reason: string;
}

export class InvalidOverrideError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOverrideError";
  }
}

/**
 * Validates an override request has everything the audit trail requires. Does NOT write to the
 * database itself — the API layer is responsible for the transactional write to `MatchOverride`
 * (packages/db/prisma/schema.prisma) and the corresponding Seat state transition. Kept as a pure
 * validation function so it's unit-testable without a DB (see T5 handoff).
 */
export function assertValidOverride(input: OverrideInput): void {
  if (!input.reason || input.reason.trim().length < 10) {
    throw new InvalidOverrideError(
      "An override reason is required and must be a real explanation, not a placeholder — this " +
        "becomes part of a permanent audit record (matching-v0 §5.2)."
    );
  }
  if (!input.gateFailed) {
    throw new InvalidOverrideError("An override must reference which specific hard gate it bypasses.");
  }
  if (!input.overriddenByUserId) {
    throw new InvalidOverrideError("An override must be attributed to a specific human user.");
  }
}
