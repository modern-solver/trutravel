import { NextResponse } from "next/server";
import { prisma } from "@trutravel/db";

/**
 * GET /api/segments — all six Segment rows for P2's Home six-tile grid
 * (docs/architecture/platform-architecture.md §9, key-screens.md §5.1). Segment identity is a
 * first-class row, not a derived filter value — every segment is returned with equal structural
 * weight regardless of `catalogLive`.
 */
export async function GET() {
  const segments = await prisma.segment.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ segments });
}
