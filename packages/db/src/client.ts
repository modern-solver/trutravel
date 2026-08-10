import { PrismaClient } from "@prisma/client";

// Singleton pattern to avoid exhausting DB connections under Next.js dev-mode hot reload.
declare global {
  // eslint-disable-next-line no-var
  var __trutravelPrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__trutravelPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__trutravelPrisma = prisma;
}
