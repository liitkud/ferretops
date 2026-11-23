import { defineConfig, devices } from "@playwright/test";

// E2E runs against a production build on port 3120 unless E2E_BASE_URL points elsewhere.
// A server already listening on that port is reused, so `pnpm build && pnpm start -p 3120` beforehand skips the rebuild.
const PORT = 3120;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm build && pnpm start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 300_000,
      },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
