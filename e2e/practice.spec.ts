import { expect, test } from "./fixtures";

test.describe("Practice selection screen", () => {
  test("renders the practice options", async ({ page }) => {
    await page.goto("/practice");

    await expect(
      page.getByRole("heading", { name: "Practice", level: 1 }),
    ).toBeVisible();

    // The operator / number / mode sections and the Start button are present.
    await expect(page.getByRole("heading", { name: "Operator" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Number" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start" }),
    ).toBeVisible();
  });

  test("Start is disabled until operator, number and mode are chosen", async ({
    page,
  }) => {
    await page.goto("/practice");

    const start = page.getByRole("button", { name: "Start" });
    await expect(start).toBeDisabled();

    // Choose an operator (+), a number (2) and the flashcards mode.
    await page.getByRole("button", { name: "+", exact: true }).click();
    await page.getByRole("button", { name: "2", exact: true }).click();
    await page.getByRole("button", { name: "flashcards" }).click();

    await expect(start).toBeEnabled();
  });
});
