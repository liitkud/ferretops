import { expect, test } from "@playwright/test";

// Home page: hero CTAs, product tabs (click + keyboard), how-it-works steps and bucket links.
test("hero CTAs link to sign-up and docs", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FerretOps/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Turn compliance docs into checks/);
  const hero = page.locator("main > section").first();
  await expect(hero.getByRole("link", { name: "Upload a policy" })).toHaveAttribute("href", "/sign-in?mode=sign-up");
  await expect(hero.getByRole("link", { name: "Read the docs" })).toHaveAttribute("href", "/docs");
});

test("product tabs switch on click and arrow keys", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Buckets" });
  const panel = page.locator("#product-panel");
  const box = await panel.boundingBox();

  await tabs.getByRole("tab", { name: "Infra" }).click();
  await expect(tabs.getByRole("tab", { name: "Infra" })).toHaveAttribute("aria-selected", "true");
  await expect(tabs.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "false");
  await expect(panel).toHaveAttribute("aria-labelledby", "product-tab-infra");

  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Evidence" })).toHaveAttribute("aria-selected", "true");
  await expect(tabs.getByRole("tab", { name: "Evidence" })).toBeFocused();

  // Clicking stops auto-advance; the panel keeps its height (no layout shift).
  await page.waitForTimeout(6500);
  await expect(tabs.getByRole("tab", { name: "Evidence" })).toHaveAttribute("aria-selected", "true");
  expect((await panel.boundingBox())?.height).toBe(box?.height);
});

test("how it works: steps select and bucket links open the matching product tab", async ({ page }) => {
  await page.goto("/");
  const how = page.locator("#how");
  await expect(how.getByRole("heading", { level: 2 })).toBeVisible();

  const rotate = how.getByRole("button", { name: /^Rotate/ });
  await rotate.click();
  await expect(rotate).toHaveAttribute("aria-pressed", "true");
  await expect(how.getByRole("button", { name: /^Detect/ })).toHaveAttribute("aria-pressed", "false");

  await how.getByRole("link", { name: "Evidence" }).click();
  await expect(page.getByRole("tab", { name: "Evidence" })).toHaveAttribute("aria-selected", "true");
});

test("reduced motion: hero content shows without waiting on animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Upload a policy" }).first()).toBeVisible();
});
