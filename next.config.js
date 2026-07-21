/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

// Let `next dev` access Cloudflare bindings (env vars, etc.) locally via the
// OpenNext adapter. Guarded to development: despite the name this spins up a
// wrangler/miniflare context on every next.config load, so under `next build`
// and `next start` (including the CI e2e webServer, and production) it must not
// run. Bindings there come from the real Worker runtime.
if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = await import(
    "@opennextjs/cloudflare"
  );
  await initOpenNextCloudflareForDev();
}

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  // Keep these out of the webpack/esbuild server bundle so they run against
  // the workerd runtime on Cloudflare. `pg-cloudflare` in particular ships a
  // "workerd" export condition — listing it here makes the OpenNext adapter
  // copy its real build into the bundle instead of the empty stub, fixing the
  // `Could not resolve "pg-cloudflare"` esbuild error from node-postgres.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "pg",
    "pg-cloudflare",
  ],

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};

export default config;
