import { NextResponse } from "next/server";
import { prisma, type SegmentKey, type SubLocation } from "@trutravel/db";

const VALID_SEGMENTS: readonly SegmentKey[] = [
  "trippy_tours",
  "thrilling_tours",
  "wellness_tours",
  "couple_getaways",
  "codehouses",
  "festivals",
];

const VALID_SUBLOCATIONS: readonly SubLocation[] = ["manali", "bir", "kasol_parvati", "spiti"];

/**
 * GET /api/trips?segment=&subLocation= — catalog browse. `segment` is REQUIRED with no
 * "all segments" default (ui-principles.md §6.2: "no treating segments as filters";
 * platform-architecture.md §9) — there is no generic cross-segment trip list endpoint.
 *
 * Data-driven sub_location filtering: only published Trip rows are ever returned, so a
 * `segment=trippy_tours` query can never surface `kasol_parvati` — not because this route filters
 * it out, but because no such Trip row can exist at all (packages/db/prisma/sql/hard_constraints.sql
 * + packages/domain/src/catalog/policy.ts). This is the read-path half of "correct by construction."
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const segment = searchParams.get("segment");
  const subLocation = searchParams.get("subLocation");

  if (!segment) {
    return NextResponse.json(
      { error: "segment is a required query parameter — there is no all-segments catalog view." },
      { status: 400 }
    );
  }
  if (!VALID_SEGMENTS.includes(segment as SegmentKey)) {
    return NextResponse.json({ error: `Unknown segment "${segment}".` }, { status: 400 });
  }
  if (subLocation && !VALID_SUBLOCATIONS.includes(subLocation as SubLocation)) {
    return NextResponse.json({ error: `Unknown subLocation "${subLocation}".` }, { status: 400 });
  }

  const trips = await prisma.trip.findMany({
    where: {
      segment: segment as SegmentKey,
      isPublished: true,
      ...(subLocation ? { subLocation: subLocation as SubLocation } : {}),
    },
    include: {
      thrillingDetail: true,
      trippyDetail: true,
      partner: { select: { id: true, legalName: true, verificationState: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ trips });
}
