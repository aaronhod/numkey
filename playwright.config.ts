import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * This environment ships a preinstalled Chromium under PLAYWRIGHT_BROWSERS_PATH
 * (downloads are disabled), which may not match the version @playwright/test
 * would otherwise fetch. Resolve the preinstalled binary and launch that.
 */
function resolveChromium(): string | undefined {
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
 * Playwright e2e config. The webServer builds/starts the production Next.js
 * server; tests exercise the public practice screens (no auth required).
 *
 * Chromium is preinstalled in this environment (PLAYWRIGHT_BROWSERS_PATH),
 * so no `playwright install` step is needed.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
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
        // Tests only hit the local server; connect directly (no proxy) and
        // disable the Chromium sandbox for containerized CI.
        launchOptions: {
          args: ["--no-sandbox", "--no-proxy-server"],
          ...(chromiumPath ? { executablePath: chromiumPath } : {}),
        },
      },
    },
  ],
  webServer: {
    command: `SKIP_ENV_VALIDATION=1 ./node_modules/.bin/next start -p ${PORT}`,
    url: `${baseURL}/sign-in`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
