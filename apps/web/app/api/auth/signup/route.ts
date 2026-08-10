import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@trutravel/db";
import { assertAgeGatePassed, AgeGateFailedError } from "@trutravel/domain";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../../../../lib/session";

/**
 * POST /api/auth/signup — create account, enforce the platform-wide 18+ gate
 * (docs/architecture/platform-architecture.md §8, risk-register §1). Email or phone (India-first,
 * phone treated as primary), dateOfBirth required. A user who fails the age gate cannot complete
 * signup at all — no User row is ever created for them.
 */

interface SignupBody {
  email?: string;
  phone?: string;
  password?: string; // used only for the email/password path; phone is OTP-first (see login route)
  dateOfBirth: string; // ISO date string
}

export async function POST(request: Request) {
  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.email && !body.phone) {
    return NextResponse.json({ error: "email or phone is required." }, { status: 400 });
  }
  if (!body.dateOfBirth) {
    return NextResponse.json({ error: "dateOfBirth is required." }, { status: 400 });
  }

  const dateOfBirth = new Date(body.dateOfBirth);
  if (Number.isNaN(dateOfBirth.getTime())) {
    return NextResponse.json({ error: "dateOfBirth is not a valid date." }, { status: 400 });
  }

  // Platform-wide 18+ hard gate, evaluated exactly once, at signup — never re-derived per segment
  // or per booking (both PRDs, matching-v0 §9, risk-register §1).
  try {
    assertAgeGatePassed(dateOfBirth);
  } catch (err) {
    if (err instanceof AgeGateFailedError) {
      // T3 handoff: emit `signup_blocked_age_gate` here once the analytics pipeline exists
      // (packages/domain/src/events/event-catalog.ts) — no emission code exists yet.
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    throw err;
  }

  if (body.email) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
  }
  if (body.phone) {
    const existing = await prisma.user.findUnique({ where: { phone: body.phone } });
    if (existing) {
      return NextResponse.json({ error: "An account with this phone number already exists." }, { status: 409 });
    }
  }

  const passwordHash = body.password ? await bcrypt.hash(body.password, 10) : null;

  const user = await prisma.user.create({
    data: {
      email: body.email ?? null,
      phone: body.phone ?? null,
      passwordHash,
      dateOfBirth,
      ageGatePassedAt: new Date(),
    },
  });

  // T3 handoff: emit `signup_completed` here once the pipeline exists (event-catalog.ts).

  const token = createSessionToken(user.id);
  const response = NextResponse.json({ userId: user.id }, { status: 201 });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
