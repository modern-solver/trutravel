import type { DepartureState, SeatState } from "@trutravel/db";

/**
 * Departure and Seat state machines — exactly as defined in P2's key-screens.md / ui-principles.md
 * and both PRDs §3 (no new states invented, per Thrilling PRD §10 / Trippy PRD §9 explicit instruction).
 */

export const DEPARTURE_TRANSITIONS: Record<DepartureState, readonly DepartureState[]> = {
  open: ["filling", "locked", "cancelled"],
  filling: ["open", "waitlist", "locked", "cancelled"],
  waitlist: ["filling", "locked", "cancelled"],
  locked: ["cancelled"],
  cancelled: [],
};

export const SEAT_TRANSITIONS: Record<SeatState, readonly SeatState[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["refund_pending", "cancelled"],
  refund_pending: ["refunded"],
  refunded: [],
  cancelled: [],
};

export class InvalidStateTransitionError extends Error {
  constructor(entity: string, from: string, to: string) {
    super(`Invalid ${entity} state transition: ${from} -> ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

export function assertDepartureTransition(from: DepartureState, to: DepartureState): void {
  if (!DEPARTURE_TRANSITIONS[from].includes(to)) {
    throw new InvalidStateTransitionError("Departure", from, to);
  }
}

export function assertSeatTransition(from: SeatState, to: SeatState): void {
  if (!SEAT_TRANSITIONS[from].includes(to)) {
    throw new InvalidStateTransitionError("Seat", from, to);
  }
}
