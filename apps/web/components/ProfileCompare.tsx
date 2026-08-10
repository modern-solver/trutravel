export function ProfileCompare({
  rows,
}: {
  rows: { label: string; yours: string | null; tripNeeds: string }[];
}) {
  return (
    <section className="detail-panel" aria-label="Your profile versus this trip">
      <h2>Your profile vs. this trip</h2>
      <p>Factual side-by-side — not a match score.</p>
      <div className="compare-grid">
        {rows.map((row) => (
          <div className="compare-cell" key={row.label}>
            <div className="label">{row.label}</div>
            <p className="t-body" style={{ margin: "0 0 8px" }}>
              Your declaration: <strong>{row.yours ?? "Not declared yet"}</strong>
            </p>
            <p className="t-body" style={{ margin: 0 }}>
              This trip needs: <strong>{row.tripNeeds.replace(/_/g, " ")}</strong>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
