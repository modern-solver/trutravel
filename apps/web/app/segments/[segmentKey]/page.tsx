import { notFound } from "next/navigation";
import { prisma, type SegmentKey } from "@trutravel/db";
import { SegmentChip } from "@/components/SegmentChip";
import { SegmentTripBrowser } from "@/components/SegmentTripBrowser";
import { WaitlistForm } from "@/components/WaitlistForm";
import type { TripCardModel } from "@/components/TripCard";
import { isSegmentKey, SEGMENT_META } from "@/lib/segments";

export const dynamic = "force-dynamic";

export default async function SegmentPage({ params }: { params: { segmentKey: string } }) {
  if (!isSegmentKey(params.segmentKey)) notFound();
  const segmentKey = params.segmentKey as SegmentKey;

  const segment = await prisma.segment.findUnique({ where: { key: segmentKey } });
  if (!segment) notFound();

  const meta = SEGMENT_META[segmentKey];
  const accent = meta.accent;

  if (!segment.catalogLive) {
    return (
      <main className="container">
        <header className="page-header">
          <div className="eyebrow">
            <SegmentChip accent={accent} label={segment.name} />
          </div>
          <h1 className="t-h1" style={{ margin: "0 0 8px" }}>
            {segment.name}
          </h1>
          <p className="t-body" style={{ margin: 0, color: "var(--ink-secondary)", maxWidth: "36rem" }}>
            {meta.jtbd}
          </p>
        </header>
        <div className="pending-block">
          <h2 className="t-h2" style={{ marginTop: 0 }}>
            Coming to Himachal
          </h2>
          <p>{meta.pendingBlurb}</p>
          <WaitlistForm segmentName={segment.name} />
        </div>
      </main>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { segment: segmentKey, isPublished: true },
    include: {
      thrillingDetail: { include: { guide: true } },
      trippyDetail: true,
      partner: { select: { id: true, legalName: true, verificationState: true } },
      departures: { orderBy: { dateStart: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const cardModels: TripCardModel[] = await Promise.all(
    trips.map(async (trip) => {
      const next = trip.departures[0] ?? null;
      const confirmedSeatCount = next
        ? await prisma.seat.count({ where: { departureId: next.id, state: "confirmed" } })
        : 0;
      return {
        id: trip.id,
        title: trip.title,
        segment: trip.segment,
        subLocation: trip.subLocation,
        durationDays: trip.durationDays,
        priceINR: trip.priceINR,
        partner: trip.partner,
        nextDeparture: next
          ? {
              id: next.id,
              dateStart: next.dateStart,
              state: next.state,
              capacity: next.capacity,
              confirmedSeatCount,
            }
          : null,
        guideLabel: trip.thrillingDetail?.guide
          ? `Guide certified — ${trip.thrillingDetail.guide.certificationGrade ?? trip.thrillingDetail.guide.certificationRef}`
          : null,
        captainLabel:
          trip.segment === "trippy_tours" ? "Captain trained · Code of Conduct" : null,
      };
    })
  );

  // Data-driven sub-location filter — no hardcoded chip list; Parvati never appears unless a live
  // Trip carries it (which Trippy hard-blocks at the DB layer).
  const subLocations = [...new Set(trips.map((t) => t.subLocation))];

  const tagFilters =
    segmentKey === "thrilling_tours"
      ? [
          {
            key: "skill_level",
            label: "Skill",
            values: [...new Set(trips.map((t) => t.thrillingDetail?.skillLevelMin).filter(Boolean))] as string[],
          },
          {
            key: "activity_type",
            label: "Activity",
            values: [...new Set(trips.map((t) => t.thrillingDetail?.activityType).filter(Boolean))] as string[],
          },
        ]
      : segmentKey === "trippy_tours"
        ? [
            {
              key: "pace_preference",
              label: "Pace",
              values: [...new Set(trips.map((t) => t.trippyDetail?.pacePreference).filter(Boolean))] as string[],
            },
            {
              key: "group_size_pref",
              label: "Group size",
              values: [...new Set(trips.map((t) => t.trippyDetail?.groupSizePref).filter(Boolean))] as string[],
            },
          ]
        : [];

  return (
    <main className="container">
      <header className="page-header">
        <div className="eyebrow">
          <SegmentChip accent={accent} label={segment.name} />
        </div>
        <h1 className="t-h1" style={{ margin: "0 0 8px" }}>
          {segment.name}
        </h1>
        <p className="t-body" style={{ margin: "0 0 24px", color: "var(--ink-secondary)", maxWidth: "36rem" }}>
          {meta.jtbd}
        </p>
        <div
          className={`content-frame content-frame--hero content-frame--${accent === "thrilling" || accent === "trippy" ? accent : "neutral"}`}
        >
          <span className="frame-caption">
            Bounded content frame — real {accent === "thrilling" ? "route / launch" : "group / place"}{" "}
            photography, not a full-bleed cliché hero.
          </span>
        </div>
      </header>

      <SegmentTripBrowser trips={cardModels} filters={{ subLocations, tagFilters }} />
    </main>
  );
}
