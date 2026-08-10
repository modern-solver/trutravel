/**
 * Platform-wide 18+ hard gate at signup.
 *
 * Both PRDs are explicit this is NOT a per-segment matching tag and is NEVER re-derived or
 * re-asked per booking (Thrilling PRD §5, Trippy PRD §5, matching-v0 §9, risk-register §1).
 * It is evaluated exactly once, at account creation.
 */

const MINIMUM_AGE_YEARS = 18;

export function isAgeGatePassed(dateOfBirth: Date, now: Date = new Date()): boolean {
  const cutoff = new Date(
    now.getFullYear() - MINIMUM_AGE_YEARS,
    now.getMonth(),
    now.getDate()
  );
  return dateOfBirth.getTime() <= cutoff.getTime();
}

export class AgeGateFailedError extends Error {
  constructor() {
    super(
      "Signup blocked: date of birth indicates the applicant is under 18. This is a platform-wide " +
        "hard gate (India's legal age of majority) and has no override path — not a per-segment or " +
        "per-booking check."
    );
    this.name = "AgeGateFailedError";
  }
}

export function assertAgeGatePassed(dateOfBirth: Date, now: Date = new Date()): void {
  if (!isAgeGatePassed(dateOfBirth, now)) {
    throw new AgeGateFailedError();
  }
}
