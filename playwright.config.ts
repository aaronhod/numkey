import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const baseURL = `http://127.0.0.1:${PORT}`;
const isCI = !!process.env.CI;

/**
 * Some local sandboxes ship a preinstalled Chromium under
 * PLAYWRIGHT_BROWSERS_PATH (with downloads disabled) that may not match the
 * version @playwright/test would fetch. Outside CI we resolve and launch that
 * binary (with --no-sandbox, since those sandboxes run as root). On CI we use
 * Playwright's own installed browser with default options.
 */
function resolveChromium(): string | undefined {
  if (isCI) return undefined;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  try {
    const dir = fs
      .readdirSync(root)
      .filter((d) => d.startsWith("chromium-"))
      .sort()
      .pop();
    if (!dir) return undefined;
    const bin = path.join(root, dir, "chrome-linux", "chrome");
    return fs.existsSync(bin) ? bin : undefined;
  } catch {
    return undefined;
  }
}

const chromiumPath = resolveChromium();

/**
 * Playwright e2e config. The webServer starts the production Next.js server;
 * tests exercise the public practice screens (no auth required).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(chromiumPath
          ? {
              launchOptions: {
                executablePath: chromiumPath,
                args: ["--no-sandbox"],
              },
            }
          : {}),
      },
    },
  ],
  webServer: {
    command: `SKIP_ENV_VALIDATION=1 ./node_modules/.bin/next start -p ${PORT}`,
    url: `${baseURL}/sign-in`,
    // Reuse a server started by the CI step (so the server keeps proxy access
    // for Clerk while the browser runs without a proxy). Falls back to starting
    // its own server locally.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
