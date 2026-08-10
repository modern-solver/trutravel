/**
 * OTP provider CONTRACT for phone-first auth (India market — both PRDs' explicit "phone/OTP-first"
 * requirement; see docs/architecture/platform-architecture.md §8). This module defines the
 * interface and ships exactly one implementation: a console-logging, in-memory DEV STUB.
 *
 * There is no real SMS/telephony integration anywhere in this codebase. T4 owns wiring a real
 * vendor (e.g. MSG91, Twilio Verify) plus rate limiting and secret management
 * (platform-architecture.md §8, §12) — do not use `ConsoleOtpProvider` outside local dev, and do
 * not treat its presence as "auth is done."
 */

export interface OtpProvider {
  requestOtp(phone: string): Promise<{ requested: true }>;
  verifyOtp(phone: string, code: string): Promise<boolean>;
}

interface PendingOtp {
  code: string;
  expiresAt: number;
}

const OTP_TTL_MS = 1000 * 60 * 5; // 5 minutes

/**
 * DEV-ONLY stub: "sends" the OTP by logging it to the server console instead of an SMS vendor, and
 * verifies against an in-memory store. Not durable across process restarts, not rate-limited, not
 * safe for any real deployment — see file header. `apps/web` wires a singleton instance of this;
 * T4 replaces the singleton with a real vendor-backed implementation of the same interface.
 */
export class ConsoleOtpProvider implements OtpProvider {
  private pending = new Map<string, PendingOtp>();

  async requestOtp(phone: string): Promise<{ requested: true }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.pending.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
    // eslint-disable-next-line no-console
    console.log(`[ConsoleOtpProvider] OTP for ${phone}: ${code} (dev stub — not a real SMS send)`);
    return { requested: true };
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const entry = this.pending.get(phone);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.pending.delete(phone);
      return false;
    }
    const ok = entry.code === code;
    if (ok) this.pending.delete(phone);
    return ok;
  }
}
