import type { PaymentMilestoneKey, PaymentMilestoneState } from "@trutravel/db";
import { bpsOf, MS_PER_DAY, MS_PER_HOUR, type PricingPolicyConfig } from "./pricing-policy";

/**
 * Seat payment schedule (GLD-4, prd://payments-cancellation-engine §"Payment schedule").
 *
 * 10% at booking -> cumulative 60% by T-14 days -> cumulative 100% by T-48h. Between milestones the
 * traveler may drip any number of partial payments of any amount; the milestones are the only hard
 * constraints, and each is a CUMULATIVE target rather than a fixed tranche size.
 *
 * Pure functions over plain numbers/dates — no DB, no provider, no clock of its own (`now` is always
 * passed in) so the whole schedule is unit-testable without a database.
 */

export interface ScheduledMilestone {
  key: PaymentMilestoneKey;
  /** Total that must have been paid by `dueAt` — not the size of this tranche. */
  cumulativeDueINR: number;
  dueAt: Date;
}

export interface MilestoneStatus extends ScheduledMilestone {
  state: PaymentMilestoneState;
  /** Still owed for THIS milestone at the evaluation instant. Zero once the milestone is met. */
  shortfallINR: number;
}

export interface ScheduleInput {
  totalAmountINR: number;
  /** Departure `dateStart`. The final milestone is measured back from this instant. */
  departureAt: Date;
  /** When the seat was created — the deposit is due immediately, at booking. */
  bookedAt: Date;
}

/**
 * Builds the three milestones for a seat.
 *
 * The final milestone is the seat's total amount EXACTLY, not `bpsOf(total, 10000)`: routing 100%
 * through the bps helper would let a rounding step leave a stray rupee outstanding and mark an
 * otherwise fully-paid traveler as not in a valid boarding state.
 *
 * A milestone whose computed due date has already passed (a late booking made inside T-14, or even
 * inside T-48h) is clamped to `bookedAt` rather than dropped — the money is owed immediately, and a
 * schedule that silently omits a milestone would let a seat board with an outstanding balance.
 */
export function buildPaymentSchedule(
  policy: PricingPolicyConfig,
  input: ScheduleInput
): ScheduledMilestone[] {
  const { totalAmountINR, departureAt, bookedAt } = input;

  const middleDueAt = new Date(
    departureAt.getTime() - policy.middleMilestoneDaysBefore * MS_PER_DAY
  );
  const finalDueAt = new Date(
    departureAt.getTime() - policy.finalMilestoneHoursBefore * MS_PER_HOUR
  );

  const clamp = (d: Date): Date => (d.getTime() < bookedAt.getTime() ? bookedAt : d);

  return [
    {
      key: "deposit",
      cumulativeDueINR: bpsOf(totalAmountINR, policy.depositBps),
      dueAt: bookedAt,
    },
    {
      key: "middle",
      cumulativeDueINR: bpsOf(totalAmountINR, policy.middleCumulativeBps),
      dueAt: clamp(middleDueAt),
    },
    {
      key: "final",
      cumulativeDueINR: totalAmountINR,
      dueAt: clamp(finalDueAt),
    },
  ];
}

/**
 * Evaluates a schedule against what has actually been paid.
 *
 * `met` is monotonic in paid amount: because the targets are cumulative, paying 60% satisfies both
 * the deposit and the middle milestone at once. That is deliberate — a traveler who pays the whole
 * trip up front must never be shown an "overdue" deposit.
 */
export function evaluateMilestones(
  schedule: readonly ScheduledMilestone[],
  paidAmountINR: number,
  now: Date
): MilestoneStatus[] {
  return schedule.map((m) => {
    const shortfallINR = Math.max(0, m.cumulativeDueINR - paidAmountINR);
    let state: PaymentMilestoneState;
    if (shortfallINR === 0) {
      state = "met";
    } else if (now.getTime() > m.dueAt.getTime()) {
      state = "overdue";
    } else {
      state = "pending";
    }
    return { ...m, state, shortfallINR };
  });
}

/**
 * The next milestone the traveler has to act on, or null when everything is paid.
 *
 * Used by the payment-schedule endpoint and by the reminder scan to decide what to nudge about.
 */
export function nextUnmetMilestone(statuses: readonly MilestoneStatus[]): MilestoneStatus | null {
  return statuses.find((s) => s.state !== "met") ?? null;
}

/**
 * A seat with a non-zero balance at T-48h is NOT a valid boarding state (ticket, PRD §5).
 *
 * This is a read-only assessment, not an enforcement action: the ticket requires the condition be
 * surfaced to Captain and Ops ahead of the deadline, so nothing here cancels or blocks a seat.
 */
export function isValidBoardingState(balanceAmountINR: number): boolean {
  return balanceAmountINR <= 0;
}

/**
 * Whether the pay-in-full souvenir bonus has been earned: cumulative paid reached 100% of the trip
 * amount by the final (T-48h) milestone.
 *
 * PRD "Settled: Option B" — the trigger deadline is the same one every boarding traveler must hit,
 * which makes the bonus effectively universal. @user accepted that intentionally; it is not a bug
 * and must not be "fixed" by quietly moving the deadline earlier.
 */
export function isPayInFullBonusEarned(
  totalAmountINR: number,
  paidAmountINR: number,
  finalDueAt: Date,
  paidAt: Date
): boolean {
  return paidAmountINR >= totalAmountINR && paidAt.getTime() <= finalDueAt.getTime();
}
