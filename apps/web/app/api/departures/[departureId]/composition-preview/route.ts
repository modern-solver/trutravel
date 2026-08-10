import { NextResponse } from "next/server";
import { prisma } from "@trutravel/db";
import { computeCompositionPreview } from "@trutravel/domain";

/**
 * GET /api/departures/:departureId/composition-preview — the data layer for P2's reserved
 * group-composition-preview trust-strip slot (platform-architecture.md §0/§6, key-screens.md §6.6).
 * Returns the aggregate, privacy-respecting CompositionPreview shape — a per-tag mode + distribution
 * over the CONFIRMED roster only, never per-traveler data.
 */
export async function GET(_request: Request, { params }: { params: { departureId: string } }) {
  const departure = await prisma.departure.findUnique({
    where: { id: params.departureId },
    include: { trip: true },
  });

  if (!departure) {
    return NextResponse.json({ error: "Departure not found." }, { status: 404 });
  }

  const segment = departure.trip.segment;
  if (segment !== "thrilling_tours" && segment !== "trippy_tours") {
    return NextResponse.json(
      { error: `Composition preview is not available for segment "${segment}" in this slice.` },
      { status: 400 }
    );
  }

  const confirmedSeats = await prisma.seat.findMany({
    where: { departureId: departure.id, state: "confirmed" },
    select: { userId: true },
  });
  const userIds = confirmedSeats.map((seat) => seat.userId);

  let tagRows: Record<string, string>[];
  if (segment === "thrilling_tours") {
    const profiles = await prisma.thrillingTravelerProfile.findMany({ where: { userId: { in: userIds } } });
    tagRows = profiles.map((p) => ({
      skill_level: p.skillLevel,
      fitness_level: p.fitnessLevel,
      risk_appetite: p.riskAppetite,
    }));
  } else {
    const profiles = await prisma.trippyTravelerProfile.findMany({ where: { userId: { in: userIds } } });
    tagRows = profiles.map((p) => ({
      pace_preference: p.pacePreference,
      group_size_pref: p.groupSizePref,
      noise_energy: p.noiseEnergy,
      spiritual_openness: p.spiritualOpenness,
      photography_comfort: p.photographyComfort,
    }));
  }

  const compositionPreview = computeCompositionPreview(departure.id, segment, tagRows);

  // T3 handoff: emit `composition_preview_rendered` here once the pipeline exists (event-catalog.ts).

  return NextResponse.json({ compositionPreview });
}
