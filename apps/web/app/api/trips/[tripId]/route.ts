import { NextResponse } from "next/server";
import { prisma } from "@trutravel/db";

/**
 * GET /api/trips/:tripId — Trip detail, joined to its segment extension table (Thrilling or
 * Trippy — see platform-architecture.md §4.2) plus Partner/Corridor/Departures for P2's Trip
 * detail trust strip (key-screens.md §6).
 */
export async function GET(_request: Request, { params }: { params: { tripId: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.tripId },
    include: {
      thrillingDetail: { include: { guide: true } },
      trippyDetail: true,
      partner: true,
      corridor: true,
      departures: { orderBy: { dateStart: "asc" } },
    },
  });

  if (!trip || !trip.isPublished) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  // T3 handoff: emit `trip_viewed` here once the analytics pipeline exists (event-catalog.ts).

  return NextResponse.json({ trip });
}
