import type { SegmentKey } from "@trutravel/db";

/**
 * The framework-free mirror of the `PricingPolicy` Prisma row (GLD-4,
 * prd://payments-cancellation-engine).
 *
 * Every percentage the payments engine uses is carried here and nowhere else. The ticket is
 * explicit: "All percentages live in configuration (PricingPolicy rows, per-niche, versioned),
 * never literals." That is why this module exports no default numbers of its own — the seed data in
 * packages/db/prisma/seed.ts owns the launch values, and changing one is a config-row edit.
 *
 * Percentages are BASIS POINTS (1% = 100 bps), never floats: money math on a float percentage
 * accumulates rounding error that shows up as a rupee missing from a refund.
 */
export interface PricingPolicyConfig {
  segment: SegmentKey;
  version: number;

  // --- Payment schedule (cumulative targets, as bps of the seat's total amount) ---
  /** Interest deposit taken at booking. Confirms the seat. */
  depositBps: number;
  /** CUMULATIVE target by the middle milestone — not the size of that tranche. */
  middleCumulativeBps: number;
  /** Days before departure the middle milestone falls due. */
  middleMilestoneDaysBefore: number;
  /**
   * Hours before departure the final (cumulative 100%) milestone falls due. Hours, not days,
   * because @user's rule is "rest 48 hrs prior to the trip itself" — day granularity loses that.
   */
  finalMilestoneHoursBefore: number;

  // --- Cancellation (fee base is ALWAYS the deposit, in every window) ---
  cancellationFlatFeeINR: number;
  cancelOutside14dBps: number;
  cancelMid14dTo48hBps: number;
  cancelInside48hBps: number;

  // --- Pay-in-full souvenir bonus ---
  /** Reimbursement ceiling as bps of the seat's total amount. */
  souvenirCapBps: number;

  // --- Reminders ---
  /** How far ahead of a milestone due date the reminder scan nudges traveler + Captain. */
  reminderLeadHours: number;
}

export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Applies a basis-point rate to a rupee amount, rounding to whole rupees.
 *
 * Rounding is applied once, at the point of application, and the result is what gets stored — no
 * caller re-derives a percentage from a stored rupee figure.
 */
export function bpsOf(amountINR: number, bps: number): number {
  return Math.round((amountINR * bps) / 10_000);
}

export class PricingPolicyNotConfiguredError extends Error {
  constructor(segment: SegmentKey) {
    super(
      `No active PricingPolicy row exists for segment "${segment}". Seed one (packages/db/prisma/seed.ts) ` +
        "before booking or cancelling seats in this segment — the engine will not fall back to a " +
        "guessed percentage."
    );
    this.name = "PricingPolicyNotConfiguredError";
  }
}
