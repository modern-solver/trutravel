import { prisma } from "@trutravel/db";
import { SegmentTile } from "@/components/SegmentTile";
import { formatSubLocation } from "@/lib/segments";
import type { SegmentKey } from "@trutravel/db";

export const dynamic = "force-dynamic";

/**
 * Home — six-segment equal-weight grid (docs/design/key-screens.md §5.1).
 * Pending segments are never grayed out; only inner content differs.
 */
export default async function HomePage() {
  const segments = await prisma.segment.findMany({ orderBy: { sortOrder: "asc" } });

  const liveStats = await Promise.all(
    segments
      .filter((s) => s.catalogLive)
      .map(async (s) => {
        const trips = await prisma.trip.findMany({
          where: { segment: s.key, isPublished: true },
          select: { subLocation: true, id: true },
        });
        const departureCount = await prisma.departure.count({
          where: {
            tripId: { in: trips.map((t) => t.id) },
            state: { in: ["open", "filling"] },
          },
        });
        const locs = [...new Set(trips.map((t) => formatSubLocation(t.subLocation)))];
        return {
          key: s.key,
          text:
            departureCount > 0
              ? `${departureCount} departure${departureCount === 1 ? "" : "s"} open · ${locs.join(" + ")}`
              : "Catalog live — check segment for dates",
        };
      })
  );
  const liveStatByKey = Object.fromEntries(liveStats.map((s) => [s.key, s.text]));

  return (
    <main>
      <section className="container home-hero">
        <h1 className="brand-hero">TruTravel</h1>
        <p>
          Six product lines, equal weight. Pick a segment — then browse real departures with trust
          signals beside price and dates.
        </p>
      </section>

      <section className="container segment-grid" aria-label="Segments">
        {segments.map((segment) => (
          <SegmentTile
            key={segment.key}
            segmentKey={segment.key as SegmentKey}
            name={segment.name}
            catalogLive={segment.catalogLive}
            liveStat={liveStatByKey[segment.key]}
          />
        ))}
      </section>
    </main>
  );
}
