import { NextResponse } from "next/server";
import { prisma, Prisma } from "@trutravel/db";
import {
  evaluateThrillingGroupBooking,
  evaluateTrippyGroupBooking,
  type GroupSeatRequest,
  type ThrillingHardGateContext,
  type TrippyHardGateContext,
} from "@trutravel/domain";
import { getSession } from "../../../../../lib/get-session";

/**
 * POST /api/departures/:departureId/seats — booking initiate (one or many seats in a single
 * transaction). Runs per-seat hard gates (matching-v0 §2, §5.3) and creates `Pending` Seat rows for
 * every traveler who clears their own gates. **Does not capture payment** — that's T2's build
 * (platform-architecture.md §7, §11/§12).
 *
 * Per matching-v0 §5.3, a group booking is a LOCKED PLACEMENT UNIT but every seat still clears hard
 * gates independently: this handler creates a seat for each passing userId and reports the rest as
 * `failedSeats` — it never blocks the whole request because one member of a group fails a gate.
 */

interface SeatRequestBody {
  /** userIds booked together in one transaction. The authenticated user must be one of them. */
  userIds: string[];
}

export async function POST(request: Request, { params }: { params: { departureId: string } }) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: SeatRequestBody;
  try {
    body = (await request.json()) as SeatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!Array.isArray(body.userIds) || body.userIds.length === 0) {
    return NextResponse.json({ error: "userIds must be a non-empty array." }, { status: 400 });
  }
  if (!body.userIds.includes(session.userId)) {
    return NextResponse.json(
      { error: "The authenticated user must be one of the booked userIds." },
      { status: 403 }
    );
  }

  const departure = await prisma.departure.findUnique({
    where: { id: params.departureId },
    include: { trip: { include: { thrillingDetail: true, trippyDetail: true } } },
  });
  if (!departure) {
    return NextResponse.json({ error: "Departure not found." }, { status: 404 });
  }

  const segment = departure.trip.segment;
  if (segment !== "thrilling_tours" && segment !== "trippy_tours") {
    return NextResponse.json(
      { error: `Booking is not available for segment "${segment}" in this slice.` },
      { status: 400 }
    );
  }

  const confirmedCount = await prisma.seat.count({
    where: { departureId: departure.id, state: "confirmed" },
  });
  const seatCapacityRemaining = departure.capacity - confirmedCount;

  const users = await prisma.user.findMany({
    where: { id: { in: body.userIds } },
    include: { thrillingProfile: true, trippyProfile: true },
  });
  if (users.length !== body.userIds.length) {
    return NextResponse.json({ error: "One or more userIds do not exist." }, { status: 400 });
  }

  const loyaltyCounts = await prisma.loyaltySegmentCount.findMany({
    where: { userId: { in: body.userIds }, segment },
  });
  const loyaltyByUser = new Map(loyaltyCounts.map((l) => [l.userId, l.count]));

  type Evaluation = { userId: string; result: { passed: boolean; failedGateKey?: string; reason?: string } };
  let evaluations: Evaluation[];

  if (segment === "thrilling_tours") {
    const detail = departure.trip.thrillingDetail;
    if (!detail) {
      return NextResponse.json({ error: "Trip is missing Thrilling requirement data." }, { status: 500 });
    }
    const missingProfile = users.filter((u) => !u.thrillingProfile);
    if (missingProfile.length > 0) {
      return NextResponse.json(
        {
          error:
            "Every traveler must complete their Thrilling profile (skill/fitness/risk self-declaration) before booking.",
          missingProfileUserIds: missingProfile.map((u) => u.id),
        },
        { status: 400 }
      );
    }

    const requests: GroupSeatRequest<ThrillingHardGateContext>[] = users.map((u) => ({
      userId: u.id,
      context: {
        segment: "thrilling_tours",
        ageGatePassed: !!u.ageGatePassedAt,
        subLocation: departure.trip.subLocation,
        departure: { state: departure.state, seatCapacityRemaining },
        traveler: {
          skillLevel: u.thrillingProfile!.skillLevel,
          fitnessLevel: u.thrillingProfile!.fitnessLevel,
          riskAppetite: u.thrillingProfile!.riskAppetite,
          certificationHeld: u.thrillingProfile!.certificationHeld,
          gearOwnership: u.thrillingProfile!.gearOwnership,
          loyaltyTripsCount: loyaltyByUser.get(u.id) ?? 0,
        },
        trip: {
          skillLevelMin: detail.skillLevelMin,
          fitnessLevelMin: detail.fitnessLevelMin,
          requiresCertification: detail.requiresCertification,
          certificationRequired: detail.certificationRequired,
        },
      },
    }));

    evaluations = evaluateThrillingGroupBooking(requests);
  } else {
    const detail = departure.trip.trippyDetail;
    if (!detail) {
      return NextResponse.json({ error: "Trip is missing Trippy requirement data." }, { status: 500 });
    }
    const missingProfile = users.filter((u) => !u.trippyProfile);
    if (missingProfile.length > 0) {
      return NextResponse.json(
        {
          error: "Every traveler must complete their Trippy profile before booking.",
          missingProfileUserIds: missingProfile.map((u) => u.id),
        },
        { status: 400 }
      );
    }

    const requests: GroupSeatRequest<TrippyHardGateContext>[] = users.map((u) => ({
      userId: u.id,
      context: {
        segment: "trippy_tours",
        ageGatePassed: !!u.ageGatePassedAt,
        subLocation: departure.trip.subLocation,
        departure: { state: departure.state, seatCapacityRemaining },
        traveler: {
          pacePreference: u.trippyProfile!.pacePreference,
          groupSizePref: u.trippyProfile!.groupSizePref,
          noiseEnergy: u.trippyProfile!.noiseEnergy,
          spiritualOpenness: u.trippyProfile!.spiritualOpenness,
          photographyComfort: u.trippyProfile!.photographyComfort,
          loyaltyTripsCount: loyaltyByUser.get(u.id) ?? 0,
        },
        trip: {
          pacePreference: detail.pacePreference,
          groupSizePref: detail.groupSizePref,
        },
      },
    }));

    evaluations = evaluateTrippyGroupBooking(requests);
  }

  // Per matching-v0 §5.3: every seat clears hard gates independently. Create a Pending seat only
  // for userIds whose evaluation passed — a failing member never blocks the rest of the group, and
  // a failing member is never silently seated either.
  const groupBookingId = body.userIds.length > 1 ? crypto.randomUUID() : null;
  const created: { id: string; userId: string; state: string }[] = [];
  for (const evaluation of evaluations) {
    if (!evaluation.result.passed) continue;
    const seat = await prisma.seat.create({
      data: {
        departureId: departure.id,
        userId: evaluation.userId,
        state: "pending",
        groupBookingId,
        hardGateResultJson: evaluation.result as unknown as Prisma.InputJsonValue,
      },
    });
    created.push({ id: seat.id, userId: seat.userId, state: seat.state });
    // T3 handoff: emit `seat_state_changed` (created -> pending) here once the pipeline exists.
  }

  const failed = evaluations.filter((e) => !e.result.passed);
  // T3 handoff: emit `hard_gate_failed` for each entry in `failed` once the pipeline exists — this
  // is the raw material A1/G2 need for catalog/demand-mismatch analysis (platform-architecture.md §12).

  // NOTE for T2: no depositAmountINR/balanceAmountINR/totalAmountINR is set here, and payment is
  // not captured — these Seats are Pending placeholders. T2's booking/payment-capture build
  // populates the ledger fields and drives Pending -> Confirmed (see booking/state-machine.ts).

  return NextResponse.json(
    {
      createdSeats: created,
      failedSeats: failed.map((f) => ({ userId: f.userId, ...f.result })),
    },
    { status: created.length > 0 ? 201 : 422 }
  );
}
