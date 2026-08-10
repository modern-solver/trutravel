"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { SeatStateBadge, VerificationBadge } from "@/components/StateBadge";
import { DRAFT_POLICY, formatDate, formatINR } from "@/lib/segments";

type StepId = "self" | "safety" | "policy" | "payment" | "confirmation";

const STEPS: { id: StepId; label: string }[] = [
  { id: "self", label: "1. Self-declaration" },
  { id: "safety", label: "2. Safety basics" },
  { id: "policy", label: "3. Policy review" },
  { id: "payment", label: "4. Payment" },
  { id: "confirmation", label: "5. Confirmation" },
];

export type BookingTrip = {
  id: string;
  title: string;
  segment: "thrilling_tours" | "trippy_tours";
  priceINR: number;
  partnerVerification: string;
  partnerName: string;
  departure: {
    id: string;
    dateStart: string;
    dateEnd: string;
    capacity: number;
    confirmedSeatCount: number;
  };
  hasSelfDeclaration: boolean;
};

export function BookingFlow({ trip }: { trip: BookingTrip }) {
  const startStep: StepId = trip.hasSelfDeclaration ? "safety" : "self";
  const [step, setStep] = useState<StepId>(startStep);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [policyAck, setPolicyAck] = useState(false);
  const [createdSeats, setCreatedSeats] = useState<{ id: string; state: string }[]>([]);

  const deposit = Math.round(trip.priceINR * (DRAFT_POLICY.depositPercent / 100));
  const balance = trip.priceINR - deposit;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const orderSummary = useMemo(
    () => (
      <aside className="order-summary" aria-label="Order summary">
        <h2 className="t-h3" style={{ margin: 0 }}>
          {trip.title}
        </h2>
        <p className="t-meta" style={{ margin: 0 }}>
          {formatDate(trip.departure.dateStart)}
          {trip.departure.dateEnd !== trip.departure.dateStart
            ? ` – ${formatDate(trip.departure.dateEnd)}`
            : null}
        </p>
        <div className="line-items">
          <div className="line-item">
            <span className="muted">Non-refundable deposit</span>
            <span className="tabular">{formatINR(deposit)}</span>
          </div>
          <div className="line-item">
            <span className="muted">Refundable balance</span>
            <span className="tabular">{formatINR(balance)}</span>
          </div>
          <div className="line-item">
            <span>Total</span>
            <span className="tabular">{formatINR(trip.priceINR)}</span>
          </div>
        </div>
        <div className="trust-item">
          <VerificationBadge state={trip.partnerVerification} />
          <span className="t-meta">{trip.partnerName}</span>
        </div>
        <p className="t-meta" style={{ margin: 0 }}>
          <span className="tabular">
            {trip.departure.confirmedSeatCount} of {trip.departure.capacity}
          </span>{" "}
          seats confirmed
        </p>
      </aside>
    ),
    [trip, deposit, balance]
  );

  async function saveSelfDeclaration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body =
      trip.segment === "thrilling_tours"
        ? {
            segment: "thrilling_tours",
            skillLevel: String(fd.get("skillLevel")),
            fitnessLevel: String(fd.get("fitnessLevel")),
            riskAppetite: String(fd.get("riskAppetite") || "moderate"),
          }
        : {
            segment: "trippy_tours",
            pacePreference: String(fd.get("pacePreference")),
            groupSizePref: String(fd.get("groupSizePref")),
            noiseEnergy: String(fd.get("noiseEnergy")),
          };

    const res = await fetch("/api/profile/tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save self-declaration.");
      return;
    }
    setStep("safety");
  }

  async function saveSafety(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emergencyContactName: String(fd.get("emergencyContactName")),
        emergencyContactPhone: String(fd.get("emergencyContactPhone")),
        emergencyContactRelation: String(fd.get("emergencyContactRelation")),
        medicalDisclosure: String(fd.get("medicalDisclosure") || ""),
        waiverAccepted: fd.get("waiverAccepted") === "on",
      }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save safety basics.");
      return;
    }
    setStep("policy");
  }

  async function reserveSeat() {
    setBusy(true);
    setError("");
    // Who am I?
    const meRes = await fetch("/api/me");
    const me = (await meRes.json()) as { userId?: string; error?: string };
    if (!meRes.ok || !me.userId) {
      setBusy(false);
      setError(me.error ?? "You need to be signed in to reserve a seat.");
      return;
    }

    const res = await fetch(`/api/departures/${trip.departure.id}/seats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [me.userId] }),
    });
    const data = (await res.json()) as {
      error?: string;
      createdSeats?: { id: string; userId: string; state: string }[];
      failedSeats?: { userId: string; reason?: string }[];
    };
    setBusy(false);
    if (!res.ok) {
      const failReason = data.failedSeats?.[0]?.reason;
      setError(failReason ?? data.error ?? "Could not reserve seat.");
      return;
    }
    setCreatedSeats(data.createdSeats ?? []);
    setStep("confirmation");
  }

  return (
    <div className="booking-shell">
      <div>
        <div className="step-list" role="list" aria-label="Booking progress">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              role="listitem"
              className={`step-pill ${i < stepIndex ? "is-done" : ""}`}
              aria-current={s.id === step ? "step" : undefined}
            >
              {s.label}
            </span>
          ))}
        </div>

        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        {step === "self" ? (
          <section className="detail-panel">
            <h1 className="t-h1" style={{ marginTop: 0 }}>
              Self-declaration
            </h1>
            <p>Declare once — reused for future bookings in this segment.</p>
            <form className="form-stack" onSubmit={saveSelfDeclaration}>
              {trip.segment === "thrilling_tours" ? (
                <>
                  <div className="field">
                    <label htmlFor="skillLevel">Skill level</label>
                    <select id="skillLevel" name="skillLevel" required defaultValue="beginner">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="fitnessLevel">Fitness level</label>
                    <select id="fitnessLevel" name="fitnessLevel" required defaultValue="moderate">
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="athlete">Athlete</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="riskAppetite">Risk appetite</label>
                    <select id="riskAppetite" name="riskAppetite" defaultValue="moderate">
                      <option value="cautious">Cautious</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="pacePreference">Pace preference</label>
                    <select id="pacePreference" name="pacePreference" required defaultValue="loosely_planned">
                      <option value="unplanned">Unplanned</option>
                      <option value="loosely_planned">Loosely planned</option>
                      <option value="structured">Structured</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="groupSizePref">Group size preference</label>
                    <select id="groupSizePref" name="groupSizePref" required defaultValue="standard_8_12">
                      <option value="micro_4_6">Micro (4–6)</option>
                      <option value="standard_8_12">Standard (8–12)</option>
                      <option value="large_12_plus">Large (12+)</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="noiseEnergy">Noise / energy</label>
                    <select id="noiseEnergy" name="noiseEnergy" required defaultValue="moderate">
                      <option value="chill">Chill</option>
                      <option value="moderate">Moderate</option>
                      <option value="high_energy">High energy</option>
                    </select>
                  </div>
                </>
              )}
              <button className="btn btn-primary" type="submit" disabled={busy}>
                Continue
              </button>
            </form>
          </section>
        ) : null}

        {step === "safety" ? (
          <section className="detail-panel">
            <h1 className="t-h1" style={{ marginTop: 0 }}>
              Safety basics
            </h1>
            <p>Emergency contact, medical disclosure, and waiver — not an 18+ re-prompt.</p>
            <form className="form-stack" onSubmit={saveSafety}>
              <div className="field">
                <label htmlFor="emergencyContactName">Emergency contact name</label>
                <input id="emergencyContactName" name="emergencyContactName" required />
              </div>
              <div className="field">
                <label htmlFor="emergencyContactPhone">Emergency contact phone</label>
                <input id="emergencyContactPhone" name="emergencyContactPhone" required />
              </div>
              <div className="field">
                <label htmlFor="emergencyContactRelation">Relation</label>
                <input id="emergencyContactRelation" name="emergencyContactRelation" required />
              </div>
              <div className="field">
                <label htmlFor="medicalDisclosure">Medical disclosure (optional)</label>
                <textarea id="medicalDisclosure" name="medicalDisclosure" />
              </div>
              <label className="checkbox-row">
                <input name="waiverAccepted" type="checkbox" required />
                <span>I acknowledge the activity waiver and accepted-risk disclosure.</span>
              </label>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                Continue
              </button>
            </form>
          </section>
        ) : null}

        {step === "policy" ? (
          <section className="detail-panel">
            <h1 className="t-h1" style={{ marginTop: 0 }}>
              Policy review
            </h1>
            <p>
              Deposit <span className="tabular">{DRAFT_POLICY.depositPercent}%</span> is
              non-refundable. Balance refunds follow the tiers below.
            </p>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Window</th>
                  <th>Refund of balance</th>
                </tr>
              </thead>
              <tbody>
                {DRAFT_POLICY.refundTiers.map((tier) => (
                  <tr key={tier.label}>
                    <td>{tier.label}</td>
                    <td className="tabular">{tier.refundOfBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="t-meta">{DRAFT_POLICY.operatorCancelNote}</p>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={policyAck}
                onChange={(e) => setPolicyAck(e.target.checked)}
              />
              <span>
                Policy {policyAck ? "acknowledged" : "unacknowledged"} — I understand deposit and
                refund terms.
              </span>
            </label>
            <button
              className="btn btn-primary"
              type="button"
              disabled={!policyAck}
              onClick={() => setStep("payment")}
            >
              Continue to payment
            </button>
          </section>
        ) : null}

        {step === "payment" ? (
          <section className="detail-panel">
            <h1 className="t-h1" style={{ marginTop: 0 }}>
              Payment
            </h1>
            <p>
              Two ledger lines — deposit and balance — shown separately. Payment capture is owned by
              T2; this step reserves your seat as <strong>Pending</strong> without capturing funds.
            </p>
            <div className="line-items" style={{ marginBottom: 16 }}>
              <div className="line-item">
                <span>Non-refundable deposit</span>
                <span className="tabular">{formatINR(deposit)}</span>
              </div>
              <div className="line-item">
                <span>Refundable balance</span>
                <span className="tabular">{formatINR(balance)}</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="payMethod">Payment method</label>
              <select id="payMethod" defaultValue="upi">
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="netbanking">Net banking</option>
              </select>
            </div>
            <p className="form-note">UPI is first-class for India rails.</p>
            <button className="btn btn-primary" type="button" disabled={busy} onClick={reserveSeat}>
              {busy ? "Reserving…" : "Reserve your seat"}
            </button>
          </section>
        ) : null}

        {step === "confirmation" ? (
          <section className="detail-panel">
            <h1 className="t-h1" style={{ marginTop: 0 }}>
              Seat reserved
            </h1>
            <p>What happens next: your seat is Pending until payment capture confirms it.</p>
            {createdSeats.map((seat) => (
              <p key={seat.id} className="trust-item">
                Seat <span className="tabular">{seat.id.slice(-6)}</span>{" "}
                <SeatStateBadge state={seat.state} />
              </p>
            ))}
            <p className="t-meta">Captain intro will appear here once assigned (G1/G3 ritual).</p>
            <Link href={`/trips/${trip.id}`} className="btn btn-secondary">
              Back to trip
            </Link>
          </section>
        ) : null}
      </div>
      {orderSummary}
    </div>
  );
}
