import { prisma } from "@trutravel/db";

export const dynamic = "force-dynamic";

/**
 * Functional placeholder Home route — proves the data layer works end-to-end (Segment rows render
 * with equal structural weight, catalogLive as a data fact per platform-architecture.md §4.1). This
 * is NOT P2's designed Home six-tile grid (docs/design/key-screens.md §5.1) — that visual
 * implementation is explicitly out of scope for this ticket (platform-architecture.md §11), a
 * separate FE build item.
 */
export default async function HomePage() {
  const segments = await prisma.segment.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>TruTravel</h1>
      <p>
        Platform scaffold (TKT-010) — functional placeholder, not P2&apos;s designed Home screen.
        See <code>docs/design/key-screens.md</code> for the real spec and the API routes under{" "}
        <code>app/api/</code> for what this screen (and its real implementation) call.
      </p>
      <ul>
        {segments.map((segment) => (
          <li key={segment.key}>
            {segment.name} — {segment.catalogLive ? "live" : "coming soon"}
          </li>
        ))}
      </ul>
    </main>
  );
}
