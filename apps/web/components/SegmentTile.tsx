import Link from "next/link";
import { SegmentChip } from "@/components/SegmentChip";
import { SEGMENT_META, type AccentKey } from "@/lib/segments";
import type { SegmentKey } from "@trutravel/db";

export function SegmentTile({
  segmentKey,
  name,
  catalogLive,
  liveStat,
}: {
  segmentKey: SegmentKey;
  name: string;
  catalogLive: boolean;
  liveStat?: string;
}) {
  const meta = SEGMENT_META[segmentKey];
  const accent = meta.accent as AccentKey;

  return (
    <Link
      href={`/segments/${segmentKey}`}
      className={`segment-tile segment-tile--${accent}`}
    >
      <SegmentChip accent={accent} label={name} />
      <h2>{name}</h2>
      <p className="jtbd">{meta.jtbd}</p>
      <p className="stat-row">
        {catalogLive ? (
          <span className="tabular">{liveStat ?? "Live catalog"}</span>
        ) : (
          <span>Coming to Himachal — get notified</span>
        )}
      </p>
      <span className="tile-cta">{catalogLive ? meta.ctaLive : meta.ctaPending} →</span>
    </Link>
  );
}
