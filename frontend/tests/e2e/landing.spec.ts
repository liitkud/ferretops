import { expect, test } from "@playwright/test";

// Legacy landing (/landing): the old console pitch page, kept for URL compatibility.
test("legacy landing renders and links into the legacy console", async ({
  page,
}) => {
  await page.goto("/landing");

  await expect(page).toHaveTitle(/FerretOps/i);
  await expect(
    page.getByRole("heading", { level: 1, name: /Statutory text/i }),
  ).toBeVisible();
  const hero = page.locator("#hero-title").locator("xpath=..");
  await expect(
    hero.getByRole("link", { name: /Ingest a policy/i }),
  ).toHaveAttribute("href", "/policy");
  await expect(
    hero.getByRole("link", { name: /Open the console/i }),
  ).toHaveAttribute("href", "/dashboard");
});
