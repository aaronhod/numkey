import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/env.js";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// On Cloudflare Workers a TCP socket belongs to the request that opened it,
// so a client cached across requests reuses dead pooled connections and the
// runtime cancels the request as hung ("Worker's code had hung"). Every
// other DB request then 500s.
const isCloudflareWorkers =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

/**
 * Prisma client for the current request. A fresh client per request on
 * Cloudflare Workers (its connections are cancelled with the request);
 * a process-wide cached client everywhere else.
 */
export const getDb = () =>
  isCloudflareWorkers
    ? createPrismaClient()
    : (globalForPrisma.prisma ??= createPrismaClient());
