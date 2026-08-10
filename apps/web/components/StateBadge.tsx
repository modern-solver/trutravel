import {
  ShieldCheckIcon,
  ShieldHalfIcon,
  ShieldOutlineIcon,
  ShieldXIcon,
} from "@/components/icons";

type Tone = "success" | "warning" | "danger" | "neutral";

const DEPARTURE_STATE: Record<string, { label: string; tone: Tone }> = {
  open: { label: "Open", tone: "success" },
  filling: { label: "Filling", tone: "warning" },
  waitlist: { label: "Waitlist", tone: "neutral" },
  locked: { label: "Locked", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const SEAT_STATE: Record<string, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "success" },
  refund_pending: { label: "Refund pending", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const VERIFICATION_STATE: Record<string, { label: string; tone: Tone }> = {
  verified: { label: "Verified Operator", tone: "success" },
  under_review: { label: "Under review", tone: "warning" },
  unverified: { label: "Unverified", tone: "neutral" },
  suspended: { label: "Suspended", tone: "danger" },
};

function IconForTone({ tone }: { tone: Tone }) {
  switch (tone) {
    case "success":
      return <ShieldCheckIcon />;
    case "warning":
      return <ShieldHalfIcon />;
    case "danger":
      return <ShieldXIcon />;
    default:
      return <ShieldOutlineIcon />;
  }
}

function Badge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`state-badge state-badge--${tone}`}>
      <IconForTone tone={tone} />
      {label}
    </span>
  );
}

export function DepartureStateBadge({ state }: { state: string }) {
  const meta = DEPARTURE_STATE[state] ?? { label: state, tone: "neutral" as Tone };
  return <Badge label={meta.label} tone={meta.tone} />;
}

export function SeatStateBadge({ state }: { state: string }) {
  const meta = SEAT_STATE[state] ?? { label: state, tone: "neutral" as Tone };
  return <Badge label={meta.label} tone={meta.tone} />;
}

export function VerificationBadge({ state }: { state: string }) {
  const meta = VERIFICATION_STATE[state] ?? { label: state, tone: "neutral" as Tone };
  return <Badge label={meta.label} tone={meta.tone} />;
}
