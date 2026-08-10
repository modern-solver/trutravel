import Link from "next/link";
import { SegmentChip } from "@/components/SegmentChip";
import { DepartureStateBadge, VerificationBadge } from "@/components/StateBadge";
import { CertIcon, ShieldCheckIcon } from "@/components/icons";
import {
  formatDate,
  formatINR,
  formatSubLocation,
  SEGMENT_META,
  type AccentKey,
} from "@/lib/segments";
import type { SegmentKey } from "@trutravel/db";

export type TripCardModel = {
  id: string;
  title: string;
  segment: SegmentKey;
  subLocation: string;
  durationDays: number;
  priceINR: number;
  partner: { legalName: string; verificationState: string };
  nextDeparture?: {
    id: string;
    dateStart: string | Date;
    state: string;
    capacity: number;
    confirmedSeatCount: number;
  } | null;
  guideLabel?: string | null;
  captainLabel?: string | null;
};

export function TripCard({ trip }: { trip: TripCardModel }) {
  const meta = SEGMENT_META[trip.segment];
  const accent = meta.accent as AccentKey;
  const cta = trip.segment === "thrilling_tours" ? "See the route" : "See the gathering";
  const frameClass =
    accent === "thrilling" || accent === "trippy" ? `content-frame--${accent}` : "content-frame--neutral";

  return (
    <article className="trip-card">
      <div className={`content-frame ${frameClass}`}>
        <div className="chip-overlay">
          <SegmentChip
            accent={accent}
            label={trip.segment === "thrilling_tours" ? "Thrilling Tours" : "Trippy Tours"}
          />
        </div>
        <span className="frame-caption">
          {formatSubLocation(trip.subLocation)} · terrain / group content frame
        </span>
      </div>
      <div className="trip-card-body">
        <h3>{trip.title}</h3>
        <p className="t-meta">
          {formatSubLocation(trip.subLocation)} ·{" "}
          <span className="tabular">
            {trip.durationDays} {trip.durationDays === 1 ? "day" : "days"}
          </span>
        </p>
        <div className="price-date">
          <span className="tabular">{formatINR(trip.priceINR)}</span>
          {trip.nextDeparture ? (
            <>
              <span className="t-meta">{formatDate(trip.nextDeparture.dateStart)}</span>
              <DepartureStateBadge state={trip.nextDeparture.state} />
            </>
          ) : (
            <span className="t-meta">No open departure</span>
          )}
        </div>

        {/* Trust strip — mandatory, never collapsed (key-screens §4 slot 7) */}
        <div className="trust-strip" aria-label="Trust signals">
          <span className="trust-item">
            <VerificationBadge state={trip.partner.verificationState} />
          </span>
          {trip.segment === "thrilling_tours" ? (
            <span className="trust-item">
              <CertIcon />
              {trip.guideLabel ?? "Guide certified"}
            </span>
          ) : (
            <span className="trust-item">
              <ShieldCheckIcon />
              {trip.captainLabel ?? "Captain trained · Code of Conduct"}
            </span>
          )}
          {trip.nextDeparture ? (
            <span className="trust-item">
              <span className="tabular">
                {trip.nextDeparture.confirmedSeatCount} of {trip.nextDeparture.capacity}
              </span>{" "}
              confirmed
            </span>
          ) : null}
        </div>

        <Link href={`/trips/${trip.id}`} className="btn btn-secondary btn-block">
          {cta}
        </Link>
      </div>
    </article>
  );
}
