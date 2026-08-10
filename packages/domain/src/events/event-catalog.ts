import type { CancellationReasonCode, DepartureState, SeatState, SegmentKey, SubLocation } from "@trutravel/db";

/**
 * Event taxonomy CONTRACT for T3 (Data/Analytics Engineer).
 *
 * This file defines event NAMES, approximate TRIGGER POINTS (see comments), and PAYLOAD SHAPES so
 * instrumentation has a stable contract to build against. It does NOT emit anything — there is no
 * analytics pipeline, funnel logic, or dashboard code anywhere in this package or apps/web. That is
 * explicitly T3's build, out of scope for this ticket (see platform-architecture.md §11/§12).
 *
 * Wire emission at the call sites named in each comment when T3's ticket picks this up.
 */
export type TruTravelEvent =
  // Trigger: apps/web/app/api/auth/signup/route.ts, after age-gate + user creation succeed.
  | { name: "signup_completed"; payload: { userId: string; ageGatePassed: true } }
  // Trigger: age-gate.ts assertAgeGatePassed() throwing during signup. Useful for A1/G1 funnel work.
  | { name: "signup_blocked_age_gate"; payload: {} }
  // Trigger: whenever a ThrillingTravelerProfile/TrippyTravelerProfile is created or updated.
  | { name: "segment_profile_declared"; payload: { userId: string; segment: SegmentKey } }
  // Trigger: GET /api/trips/:tripId
  | {
      name: "trip_viewed";
      payload: { tripId: string; segment: SegmentKey; subLocation: SubLocation };
    }
  // Trigger: any evaluateThrillingHardGates / evaluateTrippyHardGates call that returns passed: false.
  // Raw material for understanding catalog/demand mismatch (e.g. how many travelers hit Thrilling's
  // skill gate) — flagged in platform-architecture.md §12 as useful for A1/G2, wire early.
  | {
      name: "hard_gate_failed";
      payload: { userId: string; departureId: string; segment: SegmentKey; failedGateKey: string };
    }
  // Trigger: matching/overrides.ts assertValidOverride() succeeding + the API layer's DB write to
  // MatchOverride. Matching-v0 §5.2 explicitly ties this audit requirement to the event taxonomy,
  // not just the DB row.
  | {
      name: "match_override_applied";
      payload: { seatId: string; departureId: string; overriddenByUserId: string; gateFailed: string };
    }
  // Trigger: any Seat.state write, via booking/state-machine.ts assertSeatTransition succeeding.
  | {
      name: "seat_state_changed";
      payload: {
        seatId: string;
        from: SeatState;
        to: SeatState;
        reasonCode?: CancellationReasonCode;
      };
    }
  // Trigger: any Departure.state write, via booking/state-machine.ts assertDepartureTransition succeeding.
  | { name: "departure_state_changed"; payload: { departureId: string; from: DepartureState; to: DepartureState } }
  // Trigger: GET /api/departures/:departureId/composition-preview
  | { name: "composition_preview_rendered"; payload: { departureId: string; segment: SegmentKey } };
