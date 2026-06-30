import { defineConfig } from "prisma/config";

/**
 * Prisma 7 moved connection URLs out of `schema.prisma`. The CLI (migrate,
 * db push, db seed, introspect) reads the datasource URL from here instead.
 * The runtime `PrismaClient` connects via a driver adapter (see src/server/db.ts).
 *
 * We read straight from `process.env` (instead of prisma's strict `env()` helper)
 * so that connection-less commands like `prisma generate` — which run in
 * `postinstall` without a configured database — don't fail when DATABASE_URL is
 * unset. Commands that actually connect are always invoked with the env loaded
 * (see the `with-dev-env` script in package.json).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/unset",
  },
  migrations: {
    seed: "tsx prisma/seed_problems.ts",
  },
});
