import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor wraps the existing Next.js web app in a native iOS/Android shell.
 *
 * Because this app is server-rendered (getServerSideProps, tRPC API routes,
 * Supabase auth middleware, Prisma) it cannot be statically exported, so the
 * native shell loads the hosted Next.js server rather than bundling static
 * files.
 *
 *   - Production: set CAP_SERVER_URL to your deployed URL (e.g. https://numkey.example.com)
 *   - Local device testing: set CAP_SERVER_URL to your dev machine's LAN address
 *     (e.g. http://192.168.1.20:3000) and run `next dev`.
 *
 * When CAP_SERVER_URL is unset the shell falls back to the bundled splash page
 * in `www/` (see www/index.html).
 */
const serverUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: "app.numkey",
  appName: "numkey",
  webDir: "www",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
      }
    : undefined,
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0a0a0a",
    },
  },
};

export default config;
