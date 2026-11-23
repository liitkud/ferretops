import { expect, test } from "@playwright/test";
import { LEGACY_ROUTES, NOT_FOUND_ROUTE, SITE_ROUTES } from "./routes";

// Smoke: every route answers, renders without console errors, and fits a 390px phone.
test.use({ viewport: { width: 390, height: 844 } });
test.skip(({ isMobile }) => isMobile, "Runs once, in the desktop project, at 390x844");

for (const route of [...SITE_ROUTES, ...LEGACY_ROUTES, NOT_FOUND_ROUTE]) {
  test(`smoke ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    // Legacy pages poll the backend; answer with empty lists so the smoke run needs no API.
    if (LEGACY_ROUTES.includes(route)) {
      await page.route("http://localhost:8000/**", (r) => r.fulfill({ json: [] }));
    }

    const res = await page.goto(route, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(route === NOT_FOUND_ROUTE ? 404 : 200);

    // The 404 document itself logs a failed-resource error; that one is expected.
    const real = errors.filter((e) => !(route === NOT_FOUND_ROUTE && /status of 404/.test(e)));
    expect(real, real.join("\n")).toEqual([]);

    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(390);
  });
}
