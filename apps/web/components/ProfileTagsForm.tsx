"use client";

import { useState, type FormEvent } from "react";

export function ProfileTagsForm({
  segment,
  initial,
}: {
  segment: "thrilling_tours" | "trippy_tours";
  initial?: Record<string, string | null>;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const body =
      segment === "thrilling_tours"
        ? {
            segment,
            skillLevel: String(fd.get("skillLevel")),
            fitnessLevel: String(fd.get("fitnessLevel")),
            riskAppetite: String(fd.get("riskAppetite")),
          }
        : {
            segment,
            pacePreference: String(fd.get("pacePreference")),
            groupSizePref: String(fd.get("groupSizePref")),
            noiseEnergy: String(fd.get("noiseEnergy")),
            spiritualOpenness: String(fd.get("spiritualOpenness")),
            photographyComfort: String(fd.get("photographyComfort")),
          };

    const res = await fetch("/api/profile/tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save.");
      return;
    }
    setMessage("Saved.");
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      {segment === "thrilling_tours" ? (
        <>
          <div className="field">
            <label htmlFor="skillLevel">Skill level</label>
            <select id="skillLevel" name="skillLevel" defaultValue={initial?.skillLevel ?? "beginner"}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="fitnessLevel">Fitness level</label>
            <select id="fitnessLevel" name="fitnessLevel" defaultValue={initial?.fitnessLevel ?? "moderate"}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="athlete">Athlete</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="riskAppetite">Risk appetite</label>
            <select id="riskAppetite" name="riskAppetite" defaultValue={initial?.riskAppetite ?? "moderate"}>
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
            <select
              id="pacePreference"
              name="pacePreference"
              defaultValue={initial?.pacePreference ?? "loosely_planned"}
            >
              <option value="unplanned">Unplanned</option>
              <option value="loosely_planned">Loosely planned</option>
              <option value="structured">Structured</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="groupSizePref">Group size preference</label>
            <select
              id="groupSizePref"
              name="groupSizePref"
              defaultValue={initial?.groupSizePref ?? "standard_8_12"}
            >
              <option value="micro_4_6">Micro (4–6)</option>
              <option value="standard_8_12">Standard (8–12)</option>
              <option value="large_12_plus">Large (12+)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="noiseEnergy">Noise / energy</label>
            <select id="noiseEnergy" name="noiseEnergy" defaultValue={initial?.noiseEnergy ?? "moderate"}>
              <option value="chill">Chill</option>
              <option value="moderate">Moderate</option>
              <option value="high_energy">High energy</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="spiritualOpenness">Spiritual openness</label>
            <select
              id="spiritualOpenness"
              name="spiritualOpenness"
              defaultValue={initial?.spiritualOpenness ?? "curious"}
            >
              <option value="none">None</option>
              <option value="curious">Curious</option>
              <option value="practicing">Practicing</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="photographyComfort">Photography comfort</label>
            <select
              id="photographyComfort"
              name="photographyComfort"
              defaultValue={initial?.photographyComfort ?? "ask_first"}
            >
              <option value="private">Private</option>
              <option value="ask_first">Ask first</option>
              <option value="open">Open</option>
            </select>
          </div>
        </>
      )}
      {error ? <p className="field-error">{error}</p> : null}
      {message ? <p className="form-note" role="status">{message}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save declarations"}
      </button>
    </form>
  );
}
