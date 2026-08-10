import { NextResponse } from "next/server";
import { getSession } from "../../../lib/get-session";

/**
 * POST /api/waitlist — capture notify interest for pending segments (key-screens.md §5.1–5.2).
 * Persistence is intentionally lightweight for this FE slice (log + ack); T3 can later emit an event.
 */
export async function POST(request: Request) {
  let body: { email?: string; segmentName?: string };
  try {
    body = (await request.json()) as { email?: string; segmentName?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  console.info("[waitlist]", { email: body.email, segmentName: body.segmentName ?? null });
  return NextResponse.json({ ok: true }, { status: 201 });
}

/** Keep GET for health/debug — session optional. */
export async function GET() {
  const session = getSession();
  return NextResponse.json({ ok: true, authenticated: !!session });
}
