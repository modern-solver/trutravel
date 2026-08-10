import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Session token signing/verification — a real, working HMAC-signed cookie session, NOT a
 * placeholder. What is deliberately NOT here: production secret management, rotation, or
 * revocation — that's T4's build (docs/architecture/platform-architecture.md §8, §12). The
 * `SESSION_SECRET` fallback below is loud on purpose so it can't be silently shipped.
 */

const COOKIE_NAME = "tt_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] SESSION_SECRET is not set — using an insecure development fallback. T4 must wire " +
        "real secret management (platform-architecture.md §8) before any non-local deployment."
    );
    return "dev-insecure-secret-change-in-prod";
  }
  return secret;
}

interface SessionPayload {
  userId: string;
  exp: number;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = { userId, exp: Date.now() + SESSION_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, signature] = parts as [string, string];
  const expected = sign(data);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.userId !== "string" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
