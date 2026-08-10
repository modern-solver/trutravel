import { NextResponse } from "next/server";
import { getSession } from "../../../lib/get-session";

/** GET /api/me — current session user id for booking UI. */
export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.json({ userId: session.userId });
}
