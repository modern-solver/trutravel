import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@trutravel/db";
import { computeCompositionPreview } from "@trutravel/domain";
import { SegmentChip } from "@/components/SegmentChip";
import { DepartureStateBadge } from "@/components/StateBadge";
import { ProfileCompare } from "@/components/ProfileCompare";
import { TrustStripDetail } from "@/components/TrustStripDetail";
import { getSession } from "@/lib/get-session";
import {
  DRAFT_POLICY,
  formatDate,
  formatINR,
  formatSubLocation,
  SEGMENT_META,
} from "@/lib/segments";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({ params }: { params: { tripId: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.tripId },
    include: {
      thrillingDetail: { include: { guide: true } },
      trippyDetail: true,
      partner: { include: { segmentTiers: true } },
      corridor: true,
      segmentRef: true,
      departures: {
        orderBy: { dateStart: "asc" },
        include: {
          captain: {
            include: {
              user: { select: { email: true, phone: true } },
              trainings: true,
            },
          },
        },
      },
    },
  });

  if (!trip || !trip.isPublished) notFound();
  if (trip.segment !== "thrilling_tours" && trip.segment !== "trippy_tours") notFound();

  const meta = SEGMENT_META[trip.segment];
  const departure = trip.departures[0] ?? null;
  const confirmedSeatCount = departure
    ? await prisma.seat.count({ where: { departureId: departure.id, state: "confirmed" } })
    : 0;

  let composition = null;
  if (departure && confirmedSeatCount > 0) {
    const seats = await prisma.seat.findMany({
      where: { departureId: departure.id, state: "confirmed" },
      select: { userId: true },
    });
    const userIds = seats.map((s) => s.userId);
    if (trip.segment === "thrilling_tours") {
      const profiles = await prisma.thrillingTravelerProfile.findMany({ where: { userId: { in: userIds } } });
      composition = computeCompositionPreview(
        departure.id,
        "thrilling_tours",
        profiles.map((p) => ({
          skill_level: p.skillLevel,
          fitness_level: p.fitnessLevel,
          risk_appetite: p.riskAppetite,
        }))
      );
    } else {
      const profiles = await prisma.trippyTravelerProfile.findMany({ where: { userId: { in: userIds } } });
      composition = computeCompositionPreview(
        departure.id,
        "trippy_tours",
        profiles.map((p) => ({
          pace_preference: p.pacePreference,
          group_size_pref: p.groupSizePref,
          noise_energy: p.noiseEnergy,
          spiritual_openness: p.spiritualOpenness,
          photography_comfort: p.photographyComfort,
        }))
      );
    }
  }

  const session = getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        include: { thrillingProfile: true, trippyProfile: true },
      })
    : null;

  const tier =
    trip.partner.segmentTiers.find((t) => t.segment === trip.segment)?.tier ?? null;

  const guideLabel = trip.thrillingDetail?.guide
    ? `Guide certified — ${trip.thrillingDetail.guide.certificationGrade ?? trip.thrillingDetail.guide.certificationRef}`
    : null;

  const captain = departure?.captain;
  const captainTrained = captain?.trainings.some((t) => t.trainingType === "trippy_code_of_conduct");
  const captainLabel =
    trip.segment === "trippy_tours"
      ? captain
        ? `${captain.user.email ?? captain.user.phone ?? "Captain"} · ${
            captainTrained ? "trained · Code of Conduct" : "identity verified"
          }`
        : "Captain trained · Code of Conduct"
      : null;

  const compareRows =
    trip.segment === "thrilling_tours"
      ? [
          {
            label: "Skill level",
            yours: user?.thrillingProfile?.skillLevel ?? null,
            tripNeeds: trip.thrillingDetail?.skillLevelMin ?? "—",
          },
          {
            label: "Fitness level",
            yours: user?.thrillingProfile?.fitnessLevel ?? null,
            tripNeeds: trip.thrillingDetail?.fitnessLevelMin ?? "Not required for this SKU",
          },
        ]
      : [
          {
            label: "Pace preference",
            yours: user?.trippyProfile?.pacePreference ?? null,
            tripNeeds: trip.trippyDetail?.pacePreference ?? "—",
          },
          {
            label: "Group size preference",
            yours: user?.trippyProfile?.groupSizePref ?? null,
            tripNeeds: trip.trippyDetail?.groupSizePref ?? "—",
          },
        ];

  const frameAccent = meta.accent === "thrilling" || meta.accent === "trippy" ? meta.accent : "neutral";

  return (
    <main className="container">
      <header className="page-header">
        <div className="eyebrow">
          <SegmentChip accent={meta.accent} label={trip.segmentRef.name} />
          <span className="t-meta">
            {trip.corridor.name} › {formatSubLocation(trip.subLocation)}
          </span>
        </div>
        <h1 className="t-h1" style={{ margin: 0 }}>
          {trip.title}
        </h1>
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          <div className={`content-frame content-frame--hero content-frame--${frameAccent}`}>
            <span className="frame-caption">
              Bounded gallery module — same size for every segment.
            </span>
          </div>

          <div className="price-date">
            <span className="tabular t-h2">{formatINR(trip.priceINR)}</span>
            {departure ? (
              <>
                <span className="t-meta">
                  {formatDate(departure.dateStart)}
                  {departure.dateEnd.getTime() !== departure.dateStart.getTime()
                    ? ` – ${formatDate(departure.dateEnd)}`
                    : null}
                </span>
                <DepartureStateBadge state={departure.state} />
              </>
            ) : (
              <span className="t-meta">No departure scheduled</span>
            )}
          </div>

          <TrustStripDetail
            partnerName={trip.partner.legalName}
            partnerVerification={trip.partner.verificationState}
            partnerTier={tier}
            segment={trip.segment}
            guideLabel={guideLabel}
            captainLabel={captainLabel}
            confirmed={confirmedSeatCount}
            capacity={departure?.capacity ?? 0}
            composition={composition}
          />

          <ProfileCompare rows={compareRows} />

          <section className="detail-panel">
            <h2>Itinerary</h2>
            <p>
              {trip.durationDays}-day {trip.segment === "thrilling_tours" ? "route" : "gathering"} in{" "}
              {formatSubLocation(trip.subLocation)}. Full day-by-day detail lands with operator supply
              packs (G2) — structure reserved here.
            </p>
          </section>

          <section className="detail-panel" id="full-policy">
            <h2>Full policy</h2>
            <p>
              Non-refundable deposit:{" "}
              <span className="tabular">{DRAFT_POLICY.depositPercent}%</span> of seat price.
            </p>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Window</th>
                  <th>Refund of balance</th>
                </tr>
              </thead>
              <tbody>
                {DRAFT_POLICY.refundTiers.map((tierRow) => (
                  <tr key={tierRow.label}>
                    <td>{tierRow.label}</td>
                    <td className="tabular">{tierRow.refundOfBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-meta">{DRAFT_POLICY.operatorCancelNote}</p>
            {trip.segment === "trippy_tours" ? (
              <p>
                Code of conduct applies to every Trippy departure — captains complete training before
                assignment; substance facilitation is out of scope for this product line.
              </p>
            ) : null}
          </section>

          <section className="detail-panel">
            <h2>{trip.segment === "thrilling_tours" ? "Guide" : "Captain"}</h2>
            <p>
              {trip.segment === "thrilling_tours"
                ? guideLabel ?? "Guide assignment shown when published with the departure."
                : captainLabel ?? "Captain intro appears once assigned to the departure."}
            </p>
          </section>

          <section className="detail-panel">
            <h2>Emergency / safety</h2>
            <p>
              Emergency contacts and medical disclosure are collected at booking. High-altitude
              insurance module is intentionally absent for the September standard-altitude catalog —
              the trust strip stays extensible for a future high_altitude SKU.
            </p>
          </section>
        </div>

        <aside className="sticky-cta detail-panel">
          <p className="t-h3" style={{ margin: 0 }}>
            Ready to join?
          </p>
          <p className="t-meta" style={{ margin: 0 }}>
            Trust stays visible through checkout — operator verification travels with the order
            summary.
          </p>
          {departure ? (
            <Link href={`/trips/${trip.id}/book`} className="btn btn-primary btn-block">
              Reserve your seat
            </Link>
          ) : (
            <button className="btn btn-primary btn-block" type="button" disabled>
              No open departure
            </button>
          )}
          {!session ? (
            <p className="form-note">
              <Link href="/auth/signup">Sign up</Link> or <Link href="/auth/login">log in</Link> before
              reserving.
            </p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
