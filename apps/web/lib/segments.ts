import type { SegmentKey } from "@trutravel/db";

export type AccentKey =
  | "trippy"
  | "thrilling"
  | "wellness"
  | "couples"
  | "codehouses"
  | "festivals";

export const SEGMENT_META: Record<
  SegmentKey,
  {
    accent: AccentKey;
    slug: string;
    jtbd: string;
    ctaLive: string;
    ctaPending: string;
    pendingBlurb: string;
  }
> = {
  trippy_tours: {
    accent: "trippy",
    slug: "trippy_tours",
    jtbd: "Find a crew with compatible pace — travel loose, not alone.",
    ctaLive: "Explore Trippy Tours",
    ctaPending: "Get notified",
    pendingBlurb:
      "Slow circuits and small gatherings in Himachal are next. Leave your contact and we'll notify you when this catalog opens.",
  },
  thrilling_tours: {
    accent: "thrilling",
    slug: "thrilling_tours",
    jtbd: "Match with a competent crew and a vetted route — skill first.",
    ctaLive: "Explore Thrilling Tours",
    ctaPending: "Get notified",
    pendingBlurb:
      "Adventure routes for this segment are next. Leave your contact and we'll notify you when departures open.",
  },
  wellness_tours: {
    accent: "wellness",
    slug: "wellness_tours",
    jtbd: "Reset with structure — practice, rest, and a calm group cadence.",
    ctaLive: "Explore Wellness Tours",
    ctaPending: "Get notified",
    pendingBlurb:
      "Coming to Himachal — get notified when Wellness departures open. No mocked inventory until the catalog is real.",
  },
  couple_getaways: {
    accent: "couples",
    slug: "couple_getaways",
    jtbd: "Travel as a pair with privacy and clear shared plans.",
    ctaLive: "Explore Couple Getaways",
    ctaPending: "Get notified",
    pendingBlurb:
      "Coming to Himachal — get notified when Couple Getaways open. Privacy-first product work is still in progress.",
  },
  codehouses: {
    accent: "codehouses",
    slug: "codehouses",
    jtbd: "Work and stay with people who keep the same hours and standards.",
    ctaLive: "Explore CodeHouses",
    ctaPending: "Get notified",
    pendingBlurb:
      "Coming to Himachal — get notified when CodeHouses inventory is live.",
  },
  festivals: {
    accent: "festivals",
    slug: "festivals",
    jtbd: "Arrive with a crew for music and art — seats and passes, not chaos.",
    ctaLive: "Explore Music + Art Festivals",
    ctaPending: "Get notified",
    pendingBlurb:
      "Coming next — get notified when festival departures and pass packs open.",
  },
};

export const SEGMENT_ORDER: SegmentKey[] = [
  "trippy_tours",
  "thrilling_tours",
  "wellness_tours",
  "couple_getaways",
  "codehouses",
  "festivals",
];

export function isSegmentKey(value: string): value is SegmentKey {
  return (SEGMENT_ORDER as string[]).includes(value);
}

export function formatSubLocation(value: string): string {
  switch (value) {
    case "manali":
      return "Manali";
    case "bir":
      return "Bir";
    case "kasol_parvati":
      return "Kasol / Parvati";
    case "spiti":
      return "Spiti";
    default:
      return value;
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Draft policy numbers from A2 recommendation (30–40% deposit). */
export const DRAFT_POLICY = {
  depositPercent: 35,
  refundTiers: [
    { label: "Up to 7 days before departure", refundOfBalance: "80%" },
    { label: "3–6 days before departure", refundOfBalance: "50%" },
    { label: "Within 48 hours", refundOfBalance: "0%" },
  ],
  operatorCancelNote:
    "Operator cancellations (weather abort, permit issue, min group not met) refund deposit + balance — distinct from traveler-initiated cancellation.",
} as const;
