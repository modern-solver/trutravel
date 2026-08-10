import { THRILLING_TAGS, TRIPPY_TAGS } from "./tags";
import type { TagKey } from "./types";

/**
 * Aggregate, privacy-respecting "group composition preview" data layer.
 *
 * This is the concrete answer to the coordination task in this ticket's brief: P2's
 * `key-screens.md` §6.6 reserved a Trip-detail trust-strip slot for a group-composition preview
 * pending P3's matching output, and asked P3 to confirm the output shape back to P2. P3's
 * `matching-v0.md` §3 already computes "the modal value per soft tag among the confirmed roster" as
 * part of its own soft-score rubric — this module exposes that same computation as a standalone,
 * viewer-agnostic aggregate, which is what P2's slot actually needs (a pre-commitment summary, not
 * a personalized "why you matched" explanation). See docs/architecture/platform-architecture.md §0.
 *
 * Deliberately only includes tags each segment's rubric actually scores (matching-v0 §3.1/§3.2) —
 * never gear_ownership or non-hard-gate certification_held (informational-only), and for Trippy,
 * only the five tags in TRIPPY_TAGS — which by construction cannot include a substance_stance-shaped
 * dimension because no such tag is defined anywhere in this codebase (see tags.ts).
 */

export interface CompositionPreviewTagSummary {
  tagKey: TagKey;
  modalValue: string;
  distribution: { value: string; count: number }[];
}

export interface CompositionPreview {
  departureId: string;
  confirmedSeatCount: number;
  tagSummaries: CompositionPreviewTagSummary[];
}

function distributionFor(values: readonly string[]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * @param confirmedRosterTagValues one entry per confirmed Seat, keyed by the tag's short name
 *   (e.g. "pace_preference", not the namespaced "trippy_tours.pace_preference").
 */
export function computeCompositionPreview(
  departureId: string,
  segment: "thrilling_tours" | "trippy_tours",
  confirmedRosterTagValues: readonly Record<string, string>[]
): CompositionPreview {
  const tagDefs = (segment === "thrilling_tours" ? THRILLING_TAGS : TRIPPY_TAGS).filter(
    (t) => t.scoredInSoftRubric && t.order
  );

  const tagSummaries: CompositionPreviewTagSummary[] = tagDefs.map((def) => {
    const shortKey = def.key.split(".")[1]!;
    const values = confirmedRosterTagValues
      .map((r) => r[shortKey])
      .filter((v): v is string => v !== undefined);
    const distribution = distributionFor(values);
    return {
      tagKey: def.key,
      modalValue: distribution[0]?.value ?? "",
      distribution,
    };
  });

  return {
    departureId,
    confirmedSeatCount: confirmedRosterTagValues.length,
    tagSummaries,
  };
}
