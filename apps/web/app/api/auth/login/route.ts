import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@trutravel/db";
import { otpProvider } from "../../../../lib/otp";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../../../../lib/session";

/**
 * POST /api/auth/login — OTP-stub session issuance (platform-architecture.md §8, §10).
 *
 * Two supported paths:
 *  - `{ email, password }` — standard credential check (bcrypt compare).
 *  - `{ phone }` (no otpCode) — requests an OTP via the dev-only ConsoleOtpProvider (logs to the
 *    server console, does not send a real SMS — T4 owns wiring a real vendor + rate limiting).
 *    Returns `{ status: "otp_sent" }` without a session.
 *  - `{ phone, otpCode }` — verifies the code and issues a session.
 */

interface LoginBody {
  email?: string;
  password?: string;
  phone?: string;
  otpCode?: string;
}

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.email) {
    if (!body.password) {
      return NextResponse.json({ error: "password is required for email login." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    return issueSession(user.id);
  }

  if (body.phone) {
    const user = await prisma.user.findUnique({ where: { phone: body.phone } });
    if (!user) {
      return NextResponse.json({ error: "No account found for this phone number." }, { status: 404 });
    }

    if (!body.otpCode) {
      await otpProvider.requestOtp(body.phone);
      return NextResponse.json({ status: "otp_sent" }, { status: 200 });
    }

    const verified = await otpProvider.verifyOtp(body.phone, body.otpCode);
    if (!verified) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 401 });
    }
    return issueSession(user.id);
  }

  return NextResponse.json({ error: "email or phone is required." }, { status: 400 });
}

function issueSession(userId: string): NextResponse {
  const token = createSessionToken(userId);
  const response = NextResponse.json({ userId }, { status: 200 });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
