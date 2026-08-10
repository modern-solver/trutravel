import { CertIcon } from "@/components/icons";
import { VerificationBadge } from "@/components/StateBadge";
import { DRAFT_POLICY } from "@/lib/segments";

export type CompositionPreview = {
  departureId: string;
  confirmedSeatCount: number;
  tagSummaries: {
    tagKey: string;
    modalValue: string;
    distribution: { value: string; count: number }[];
  }[];
};

export function TrustStripDetail({
  partnerName,
  partnerVerification,
  partnerTier,
  segment,
  guideLabel,
  captainLabel,
  confirmed,
  capacity,
  composition,
}: {
  partnerName: string;
  partnerVerification: string;
  partnerTier?: string | null;
  segment: "thrilling_tours" | "trippy_tours";
  guideLabel?: string | null;
  captainLabel?: string | null;
  confirmed: number;
  capacity: number;
  composition?: CompositionPreview | null;
}) {
  return (
    <section className="trust-strip trust-strip--detail" aria-label="Trust and policy">
      <div className="trust-block">
        <p className="t-micro" style={{ margin: 0, color: "var(--ink-muted)" }}>
          Anchor Operator
        </p>
        <VerificationBadge state={partnerVerification} />
        <p className="t-meta" style={{ margin: 0 }}>
          {partnerName}
          {partnerTier ? ` · Tier ${partnerTier.toUpperCase()}` : null}
        </p>
      </div>

      <div className="trust-block">
        <p className="t-micro" style={{ margin: 0, color: "var(--ink-muted)" }}>
          {segment === "thrilling_tours" ? "Guide" : "Captain"}
        </p>
        <p className="trust-item" style={{ margin: 0 }}>
          <CertIcon />
          {segment === "thrilling_tours"
            ? guideLabel ?? "Guide certified"
            : captainLabel ?? "Captain identity · Code of Conduct training"}
        </p>
      </div>

      <div className="trust-block">
        <p className="t-micro" style={{ margin: 0, color: "var(--ink-muted)" }}>
          Group fill
        </p>
        <p className="t-body" style={{ margin: 0 }}>
          <span className="tabular">
            {confirmed} of {capacity}
          </span>{" "}
          seats confirmed
        </p>
        {/* Reserved composition-preview slot (key-screens §6.6) */}
        {composition && composition.tagSummaries.length > 0 ? (
          <div className="composition-list" aria-label="Group composition preview">
            {composition.tagSummaries.map((summary) => {
              const total = summary.distribution.reduce((n, d) => n + d.count, 0) || 1;
              return (
                <div className="composition-row" key={summary.tagKey}>
                  <span className="t-meta">
                    {summary.tagKey.split(".").pop()?.replace(/_/g, " ")} — mostly{" "}
                    <strong>{summary.modalValue.replace(/_/g, " ")}</strong>
                  </span>
                  <div className="composition-bar" aria-hidden="true">
                    {summary.distribution.map((d) => (
                      <span key={d.value} style={{ width: `${(d.count / total) * 100}%` }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="t-meta" style={{ margin: 0 }}>
            Composition preview appears once confirmed seats have declared tags.
          </p>
        )}
      </div>

      <div className="trust-block">
        <p className="t-micro" style={{ margin: 0, color: "var(--ink-muted)" }}>
          Policy summary
        </p>
        <p className="t-body" style={{ margin: 0 }}>
          <span className="tabular">{DRAFT_POLICY.depositPercent}%</span> non-refundable deposit ·{" "}
          {DRAFT_POLICY.refundTiers[0].label.toLowerCase()}:{" "}
          <span className="tabular">{DRAFT_POLICY.refundTiers[0].refundOfBalance}</span> of balance
          refunded
        </p>
        <p className="t-meta" style={{ margin: 0 }}>
          {DRAFT_POLICY.operatorCancelNote}
        </p>
        <a href="#full-policy" className="t-meta" style={{ fontWeight: 600 }}>
          Full policy detail ↓
        </a>
      </div>
    </section>
  );
}
