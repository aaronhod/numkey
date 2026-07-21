import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config, following the documented CI setup
 * (https://playwright.dev/docs/ci#github-actions): the webServer starts the
 * production Next.js server and tests run against it via baseURL.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL: "http://localhost:3210",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx next start -p 3210",
    url: "http://localhost:3210/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
