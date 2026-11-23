import { expect, test, type Page } from "@playwright/test";

// Onboarding flow (spec §5 Onboarding row): steps, reading gate, Skip, Back, reduced motion.

const continueBtn = (page: Page) => page.getByRole("button", { name: /Continue|Reading…|Upload a document to continue/ });
const skipBtn = (page: Page) => page.getByRole("button", { name: "Skip for now" });
const reading = (page: Page) => page.getByTestId("reading");
const heading = (page: Page) => page.getByRole("heading", { level: 1 });
const footerTop = (page: Page) =>
  page.locator("main > div.border-t-hair").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

async function noHorizontalScroll(page: Page) {
  const width = page.viewportSize()!.width;
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(width);
}

test("sample policy: full flow, rail, slug, connections, reading gate, Skip only on step 2", async ({ page }) => {
  await page.goto("/onboarding");

  // Step 1: live slug, real label+checkbox, Back hidden, no Skip
  await expect(heading(page)).toHaveText("Name your workspace");
  await expect(page.getByText("Step 1 of 4")).toBeVisible();
  await expect(page.locator('li[aria-current="step"]')).toContainText("Workspace");
  await expect(skipBtn(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Back" })).toBeHidden();
  await expect(page.getByText("app.ferretops.dev/acme")).toBeVisible();
  await page.getByLabel("Company or team name").fill("Acme Corp!");
  await expect(page.getByText("app.ferretops.dev/acme-corp")).toBeVisible();
  await page.getByLabel("Company or team name").fill("");
  await expect(page.getByText("app.ferretops.dev/workspace")).toBeVisible();
  await page.getByLabel("Company or team name").fill("Acme");
  await expect(page.getByLabel("SOC 2")).toBeChecked();
  await page.getByText("ISO 27001").click();
  await expect(page.getByLabel("ISO 27001")).toBeChecked();
  await noHorizontalScroll(page);
  const y1 = await footerTop(page);

  // Step 2: Skip visible, Connect flips to the connected status word
  await continueBtn(page).click();
  await expect(heading(page)).toHaveText("Connect where your checks run");
  await expect(heading(page)).toBeFocused();
  await expect(page.getByText("Step 2 of 4")).toBeVisible();
  await expect(skipBtn(page)).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "Workspace" })).toContainText("Done");
  await page.getByRole("button", { name: "Connect GitHub" }).click();
  await expect(page.getByText("Connected · acme · 12 repositories")).toBeVisible();
  await expect(page.getByRole("button", { name: "Connect GitHub" })).toHaveCount(0);
  await page.getByRole("button", { name: "Connect Slack" }).click();
  await expect(page.getByText("Connected · #sec-alerts")).toBeVisible();
  await noHorizontalScroll(page);
  expect(await footerTop(page)).toBe(y1);

  // Back returns to step 1 with the name kept, then forward again
  await page.getByRole("button", { name: "Back" }).click();
  await expect(heading(page)).toHaveText("Name your workspace");
  await expect(page.getByLabel("Company or team name")).toHaveValue("Acme");
  await expect(page.getByLabel("ISO 27001")).toBeChecked();
  await continueBtn(page).click();
  await expect(page.getByText("Connected · acme · 12 repositories")).toBeVisible();

  // Step 3: Continue disabled until reading is done; Skip gone
  await continueBtn(page).click();
  await expect(heading(page)).toHaveText("Upload your first document");
  await expect(skipBtn(page)).toHaveCount(0);
  await expect(continueBtn(page)).toBeDisabled();
  await expect(continueBtn(page)).toHaveText("Upload a document to continue");
  await page.getByRole("button", { name: "Use the sample security policy instead" }).click();
  await expect(reading(page).getByText("sample-security-policy.pdf")).toBeVisible();
  await expect(reading(page).getByText(/Reading page \d+ of 12/)).toBeVisible();
  await expect(continueBtn(page)).toBeDisabled();
  await expect(continueBtn(page)).toHaveText("Reading…");
  await expect(reading(page).getByText("Done · 29 requirements")).toBeVisible({ timeout: 10_000 });
  await expect(continueBtn(page)).toBeEnabled();
  await expect(continueBtn(page)).toHaveText("Continue");
  await noHorizontalScroll(page);
  expect(await footerTop(page)).toBe(y1);

  // Step 4: buckets 14 / 9 / 6, Open workspace → /overview
  await continueBtn(page).click();
  await expect(heading(page)).toHaveText("29 requirements found");
  await expect(page.getByText("From sample-security-policy.pdf.")).toBeVisible();
  await expect(skipBtn(page)).toHaveCount(0);
  await expect(continueBtn(page)).toHaveCount(0);
  const rows = page.locator("section[data-step='4'] .box > div");
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText("Code checks");
  await expect(rows.nth(0)).toContainText("14");
  await expect(rows.nth(1)).toContainText("Infra checks");
  await expect(rows.nth(1)).toContainText("9");
  await expect(rows.nth(2)).toContainText("People tasks");
  await expect(rows.nth(2)).toContainText("6");
  await expect(page.getByText("Step 4 of 4")).toBeVisible();
  await noHorizontalScroll(page);
  expect(await footerTop(page)).toBe(y1);

  await page.getByRole("link", { name: "Open workspace" }).click();
  await expect(page).toHaveURL(/\/overview$/);
});

test("file upload: Skip on step 2, upload a file, reading gate, finish at /overview", async ({ page }) => {
  await page.goto("/onboarding");
  await continueBtn(page).click();
  await skipBtn(page).click();
  await expect(heading(page)).toHaveText("Upload your first document");
  await expect(continueBtn(page)).toBeDisabled();

  await page.locator('input[type="file"]').setInputFiles({
    name: "acme-isp.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });
  await expect(reading(page).getByText("acme-isp.pdf")).toBeVisible();
  await expect(reading(page).getByText(/Reading page \d+ of 12/)).toBeVisible();
  await expect(continueBtn(page)).toBeDisabled();
  await expect(reading(page).getByText("Done · 29 requirements")).toBeVisible({ timeout: 10_000 });
  await continueBtn(page).click();
  await expect(page.getByText("From acme-isp.pdf.")).toBeVisible();
  await page.getByRole("link", { name: "Open workspace" }).click();
  await expect(page).toHaveURL(/\/overview$/);
});

test.describe("reduced motion", () => {
  test("reading still finishes and Continue unlocks", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/onboarding");
    await continueBtn(page).click();
    await continueBtn(page).click();
    await page.getByRole("button", { name: "Use the sample security policy instead" }).click();
    await expect(continueBtn(page)).toBeDisabled();
    await expect(reading(page).getByText("Done · 29 requirements")).toBeVisible({ timeout: 10_000 });
    await expect(continueBtn(page)).toBeEnabled();
    const dur = await page
      .locator("[data-testid='reading'] [aria-hidden='true'] > span")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(dur)).toBeLessThan(0.01);
  });
});
