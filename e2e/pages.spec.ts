import { expect, test } from "@playwright/test";

/**
 * Request-level checks using Playwright's APIRequestContext (Node-side HTTP —
 * no browser). These run on every environment, including runners where the
 * browser process cannot reach the local server (see e2e/probe.mjs).
 */
test.describe("server responses", () => {
  test("practice page serves the selection UI", async ({ request }) => {
    const res = await request.get("/practice");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Practice");
    expect(html).toContain("Start");
  });

  test("flashcards page serves the ADD_2 set with cards", async ({
    request,
  }) => {
    const res = await request.get("/practice/flashcards/ADD_2");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Flash Cards");
    expect(html).toContain('data-testid="flashcard"');
    expect(html).toContain('data-testid="flashcard-answer"');
  });

  test("sign-in page serves", async ({ request }) => {
    const res = await request.get("/sign-in");
    expect(res.status()).toBe(200);
  });

  test("home is gated for anonymous users", async ({ request }) => {
    const res = await request.get("/", { maxRedirects: 0 });
    // Clerk's middleware protects the route: signed-out users get a redirect
    // to sign-in or (with test keys) a protect-rewrite 404 — never a 200.
    expect([302, 307, 404]).toContain(res.status());
  });
});
