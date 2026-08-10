import { SegmentIcon } from "@/components/icons";
import type { AccentKey } from "@/lib/segments";

export function SegmentChip({
  accent,
  label,
  className = "",
}: {
  accent: AccentKey;
  label: string;
  className?: string;
}) {
  return (
    <span className={`segment-chip segment-chip--${accent} ${className}`.trim()}>
      <SegmentIcon accent={accent} />
      {label}
    </span>
  );
}
