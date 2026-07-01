import { defineConfig } from "prisma/config";

/**
 * Prisma 7 moved connection URLs out of the schema. The CLI (generate, db push,
 * seed) reads the datasource URL from here; the runtime client connects through
 * the @prisma/adapter-pg driver adapter (see src/db.ts).
 *
 * Read from process.env directly (not prisma's strict `env()`) so connection-less
 * commands like `prisma generate` don't fail when DATABASE_URL is unset.
 */
export default defineConfig({
  schema: "src/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/unset",
  },
  migrations: {
    seed: "tsx src/seed_problems.ts",
  },
});
