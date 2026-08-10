import { evaluateThrillingHardGates, evaluateTrippyHardGates } from "../matching/hard-gates";
import type {
  HardGateResult,
  ThrillingHardGateContext,
  TrippyHardGateContext,
} from "../matching/types";

/**
 * Group booking (matching-v0 §5.3): "3 friends booking the same Departure in one transaction" are a
 * LOCKED PLACEMENT UNIT — they've already chosen each other, so soft-scoring never re-scores them
 * against one another or splits them across Departures. But every individual seat still clears hard
 * constraints INDEPENDENTLY. A group booking must never pass/fail as a single unit when members have
 * divergent skill/fitness/eligibility — this is the direct implementation of that requirement: it
 * returns a per-seat result array, never a single boolean for the transaction.
 */

export interface GroupSeatRequest<TContext> {
  userId: string;
  context: TContext;
}

export interface GroupSeatEvaluation {
  userId: string;
  result: HardGateResult;
}

export function evaluateThrillingGroupBooking(
  requests: readonly GroupSeatRequest<ThrillingHardGateContext>[]
): GroupSeatEvaluation[] {
  return requests.map((r) => ({ userId: r.userId, result: evaluateThrillingHardGates(r.context) }));
}

export function evaluateTrippyGroupBooking(
  requests: readonly GroupSeatRequest<TrippyHardGateContext>[]
): GroupSeatEvaluation[] {
  return requests.map((r) => ({ userId: r.userId, result: evaluateTrippyHardGates(r.context) }));
}

/**
 * Convenience helper for API layers: true only if every member of the group clears their own hard
 * gates. Callers MUST still act on the per-seat array above to block only the failing seat(s) — this
 * helper is for a single "can this whole group proceed to payment as-is" summary flag, not a
 * replacement for per-seat handling.
 */
export function allSeatsEligible(evaluations: readonly GroupSeatEvaluation[]): boolean {
  return evaluations.every((e) => e.result.passed);
}
