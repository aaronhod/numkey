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

  test("login page serves", async ({ request }) => {
    const res = await request.get("/login");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Sign in");
  });

  test("home is public and offers login and guest modes", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Login");
    expect(html).toContain("Guest");
  });

  test("guest quickplay page serves", async ({ request }) => {
    const res = await request.get("/play");
    expect(res.status()).toBe(200);
  });

  test("custom game setup redirects anonymous users to login", async ({
    request,
  }) => {
    const res = await request.get("/game-custom", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toBe("/login");
  });
});
