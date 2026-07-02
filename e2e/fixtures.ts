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
export const test = base.extend({
  // (second fixture arg is Playwright's `use` callback, renamed so the
  // react-hooks lint rule doesn't mistake it for a React hook)
  context: async ({ context }, provide) => {
    if (process.env.PW_TUNNEL === "1") {
      await context.route("**/*", async (route) => {
        try {
          const response = await route.fetch({ maxRedirects: 0 });
          await route.fulfill({ response });
        } catch {
          await route.abort();
        }
      });
    }
    await provide(context);
  },
});

export { expect };
