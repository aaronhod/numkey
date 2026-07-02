import { test as base, expect } from "@playwright/test";

/**
 * On the CI runners, the browser process cannot open direct network sockets —
 * even `http://127.0.0.1` fails with ERR_NAME_NOT_RESOLVED — while the Node
 * process reaches the local test server fine (curl/webServer probe get 200).
 *
 * When PW_TUNNEL=1, route every browser request through Node: `route.fetch()`
 * performs the request from the Playwright Node process and `route.fulfill()`
 * hands the response to the browser, so the browser needs no network access.
 * Redirects are not followed by the tunnel (maxRedirects: 0) so the browser
 * observes and follows them itself, preserving navigation semantics.
 */
import type { Page, Route } from "@playwright/test";

const tunnelHandler = async (route: Route) => {
  const url = route.request().url();
  try {
    const response = await route.fetch({ maxRedirects: 0 });
    await route.fulfill({ response });
  } catch (err) {
    console.log(
      `[tunnel] fetch failed for ${url}: ${String(err).split("\n")[0]}`,
    );
    await route.abort();
  }
};

export const test = base.extend({
  // (second fixture arg is Playwright's `use` callback, renamed so the
  // react-hooks lint rule doesn't mistake it for a React hook)
  page: async ({ page }: { page: Page }, provide: (p: Page) => Promise<void>) => {
    if (process.env.PW_TUNNEL === "1") {
      console.log("[tunnel] routing browser traffic through Node");
      // Register on both the page and its context — belt and braces while we
      // pin down which registration the runner's navigation respects.
      await page.route("**/*", tunnelHandler);
      await page.context().route("**/*", tunnelHandler);
    }
    await provide(page);
  },
});

export { expect };
