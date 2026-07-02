/**
 * CI diagnostic probe, run before the Playwright suite. Answers two questions
 * about the runner's browser networking:
 *
 * 1. Can Chromium navigate directly to the local test server? (expected: no —
 *    ERR_NAME_NOT_RESOLVED even for a literal IP)
 * 2. Does route interception + fulfill work for navigations? The probe
 *    fulfills a navigation to a port with nothing listening — if interception
 *    works, the navigation must succeed without any network access.
 */
import { chromium } from "@playwright/test";

const browser = await chromium.launch();

// Probe 1: direct navigation to the running server.
{
  const page = await browser.newPage();
  try {
    await page.goto("http://127.0.0.1:3210/sign-in", { timeout: 10_000 });
    console.log("PROBE direct-nav: OK");
  } catch (err) {
    console.log(`PROBE direct-nav: FAIL ${String(err).split("\n")[0]}`);
  }
  await page.close();
}

// Probe 2: fulfilled navigation to a dead port (no network needed).
{
  const context = await browser.newContext();
  await context.route("**/*", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1 id='ok'>fulfilled</h1>",
    }),
  );
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:9/", { timeout: 10_000 });
    console.log(`PROBE fulfill-nav: OK text=${await page.textContent("#ok")}`);
  } catch (err) {
    console.log(`PROBE fulfill-nav: FAIL ${String(err).split("\n")[0]}`);
  }
  await context.close();
}

await browser.close();
