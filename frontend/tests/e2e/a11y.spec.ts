import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { NOT_FOUND_ROUTE, SITE_ROUTES } from "./routes";

// axe (WCAG 2.1 A/AA) on every new-site route, in the dark and light themes. Legacy console routes are out of scope.
test.skip(({ isMobile }) => isMobile, "Runs once, in the desktop project");
test.use({ viewport: { width: 1440, height: 900 } });

for (const theme of ["dark", "light"] as const) {
  for (const route of [...SITE_ROUTES, NOT_FOUND_ROUTE]) {
    test(`axe ${theme} ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const report = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      expect(report, report.join("\n")).toEqual([]);
    });
  }
}
