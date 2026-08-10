import type { CancellationReasonCode, SegmentKey } from "@trutravel/db";

/**
 * Refund/cancellation SHAPE — not final numbers. Both PRDs (§8/§8) are explicit that A2/T2 own the
 * exact deposit %, cancellation-window day-thresholds, and refund-percentage tiers; this module
 * only encodes the structure the booking flow must support, per this ticket's DoD.
 *
 * A2's unit-economics.md recommends a 30-40% non-refundable deposit for Thrilling (thin 19.8%
 * contribution cushion, breaches the 18% floor above ~12.5% refund rate) and notes Trippy's
 * shape should mirror Thrilling's structurally but has its own, more cushioned economics (21.7%
 * baseline) — neither segment has final numbers as of this ticket.
 */

export interface RefundPolicy {
  segment: SegmentKey;
  /** Non-refundable portion on TRAVELER-initiated cancellation. Always fully refunded (with the
   *  rest) on operator-initiated cancellation — see resolveRefund() below. */
  depositPercent: number;
  cancellationWindows: readonly {
    daysBeforeDeparture: number;
    balanceRefundPercent: number;
  }[];
}

/**
 * Deliberately null for both live segments — T1 is not going to guess at a deposit percentage or
 * refund-window table. Wire real values from wherever T2's config/admin layer lives once A2
 * finalizes them (unit-economics.md recommendation 4 for Thrilling; §8 flags Trippy as still open).
 */
export const REFUND_POLICY_BY_SEGMENT: Partial<Record<SegmentKey, RefundPolicy | null>> = {
  thrilling_tours: null,
  trippy_tours: null,
};

export class RefundPolicyNotConfiguredError extends Error {
  constructor(segment: SegmentKey) {
    super(
      `No refund policy is configured for segment "${segment}" yet. A2/T2 own the deposit %, ` +
        "cancellation windows, and refund tiers — see unit-economics.md and both PRDs' §8. This is " +
        "a deliberate hard stop, not a bug: do not default to a guessed percentage."
    );
    this.name = "RefundPolicyNotConfiguredError";
  }
}

export interface CancellationInput {
  segment: SegmentKey;
  initiatedBy: "traveler" | "operator";
  reasonCode: CancellationReasonCode;
  daysBeforeDeparture: number;
  totalAmountINR: number;
  depositAmountINR: number;
  balanceAmountINR: number;
}

export interface RefundOutcome {
  refundedAmountINR: number;
  depositRefunded: boolean;
  reasonCode: CancellationReasonCode;
}

/**
 * Resolves the refund shape both PRDs' §8 require, independent of the still-unset real numbers:
 *
 *  - Operator-initiated cancellation (weather abort, permit issue, min-group-size) => full refund
 *    INCLUDING the deposit, always, regardless of timing. This must never be penalized like a
 *    traveler cancellation (both PRDs §8 item 3) and must carry a distinct CancellationReasonCode
 *    so it's structurally distinguishable in reporting even though the traveler-facing Seat state
 *    badge stays "Refunded" either way (P2 key-screens.md §6.5).
 *  - Traveler-initiated cancellation => deposit is NEVER refunded; balance refund % comes from the
 *    policy's tiered cancellation windows (real numbers: T2/A2).
 */
export function resolveRefund(policy: RefundPolicy | null | undefined, input: CancellationInput): RefundOutcome {
  if (input.initiatedBy === "operator") {
    return {
      refundedAmountINR: input.totalAmountINR,
      depositRefunded: true,
      reasonCode: input.reasonCode,
    };
  }

  if (!policy) {
    throw new RefundPolicyNotConfiguredError(input.segment);
  }

  const applicableWindow = [...policy.cancellationWindows]
    .sort((a, b) => a.daysBeforeDeparture - b.daysBeforeDeparture)
    .find((w) => input.daysBeforeDeparture >= w.daysBeforeDeparture);

  const balanceRefundPercent = applicableWindow?.balanceRefundPercent ?? 0;
  const refundedAmountINR = Math.round(input.balanceAmountINR * (balanceRefundPercent / 100));

  return {
    refundedAmountINR,
    depositRefunded: false, // never refunded on traveler-initiated cancellation
    reasonCode: "traveler_initiated",
  };
}
