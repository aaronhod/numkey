import { expect, test } from "@playwright/test";

// On runners where the browser process cannot open network sockets (see
// e2e/probe.mjs), browser-driven tests cannot reach the local server. The
// request-level coverage in pages.spec.ts still runs there.
test.skip(
  process.env.PW_BROWSER_UNAVAILABLE === "1",
  "browser cannot reach the local server on this runner",
);

test.describe("Flashcards practice", () => {
  test("loads a set and flips a card to reveal the answer", async ({
    page,
  }) => {
    await page.goto("/practice/flashcards/ADD_2");

    await expect(
      page.getByRole("heading", { name: "Flash Cards" }),
    ).toBeVisible();

    const cards = page.getByTestId("flashcard");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);

    const firstCard = cards.first();
    const answer = firstCard.getByTestId("flashcard-answer");

    // Before flipping, the answer is hidden (renders whitespace).
    await expect(answer).toHaveText(/^\s*$/);

    // Flipping the card reveals the numeric answer.
    await firstCard.click();
    await expect(answer).toHaveText(/\d+/);

    // Flipping back hides it again.
    await firstCard.click();
    await expect(answer).toHaveText(/^\s*$/);
  });
});
