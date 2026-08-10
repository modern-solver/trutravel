import { ConsoleOtpProvider, type OtpProvider } from "@trutravel/domain";

/**
 * Singleton dev-only OTP provider, cached across Next.js dev-mode hot reload (same pattern as
 * @trutravel/db's prisma client singleton — see packages/db/src/client.ts). T4 replaces this
 * module's export with a real vendor-backed OtpProvider implementation; every call site imports
 * from here, not from @trutravel/domain's ConsoleOtpProvider directly, so that swap is one-file.
 */
declare global {
  // eslint-disable-next-line no-var
  var __trutravelOtpProvider: OtpProvider | undefined;
}

export const otpProvider: OtpProvider = globalThis.__trutravelOtpProvider ?? new ConsoleOtpProvider();

if (process.env.NODE_ENV !== "production") {
  globalThis.__trutravelOtpProvider = otpProvider;
}
