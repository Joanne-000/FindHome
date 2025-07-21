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

test("sign up link", async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();

  // Click the get started link.
  await page.getByRole("link", { name: "Sign Up" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Sign Up as a New User" })
  ).toBeVisible();
});

test("listings link", async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page.getByRole("link", { name: "Listings" })).toBeVisible();

  // Click the get started link.
  await page.getByRole("link", { name: "Listings" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText("Blk 222 Bedok North")).toBeVisible();
});

test("first see details link", async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(
    page.getByRole("button", { name: /see details/i }).first()
  ).toBeVisible();

  // Click the get started link.
  await page
    .getByRole("button", { name: /see details/i })
    .first()
    .click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText("mid level floor - Bedok")).toBeVisible();
});
