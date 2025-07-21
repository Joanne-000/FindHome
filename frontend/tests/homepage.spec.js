// @ts-check
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

test("Home Page has title header", async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(
    page.locator("header h1", { hasText: "Recently Posted Listings" })
  ).toBeVisible();
});
test("Home Page has title text", async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page.getByText("Recently Posted Listings")).toBeVisible();
});
test("sign in link", async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();

  // Click the get started link.
  await page.getByRole("link", { name: "Sign In" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});
