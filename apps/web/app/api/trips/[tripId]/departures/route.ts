import { NextResponse } from "next/server";
import { prisma } from "@trutravel/db";

/**
 * GET /api/trips/:tripId/departures — Departure list for a Trip, including state and a live
 * confirmed-seat count (P2 key-screens.md fill-state trust surface).
 */
export async function GET(_request: Request, { params }: { params: { tripId: string } }) {
  const departures = await prisma.departure.findMany({
    where: { tripId: params.tripId },
    include: {
      captain: { select: { id: true, identityVerificationLevel: true } },
    },
    orderBy: { dateStart: "asc" },
  });

  const withSeatCounts = await Promise.all(
    departures.map(async (departure) => {
      const confirmedSeatCount = await prisma.seat.count({
        where: { departureId: departure.id, state: "confirmed" },
      });
      return { ...departure, confirmedSeatCount, seatCapacityRemaining: departure.capacity - confirmedSeatCount };
    })
  );

  return NextResponse.json({ departures: withSeatCounts });
}
