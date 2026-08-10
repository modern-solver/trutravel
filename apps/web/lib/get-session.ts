import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./session";

/** Reads and verifies the current request's session cookie. Returns null if absent/invalid/expired. */
export function getSession(): { userId: string } | null {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  return payload ? { userId: payload.userId } : null;
}
