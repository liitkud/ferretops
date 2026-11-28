import assert from "node:assert/strict";
import test from "node:test";
import { getApiBase } from "../services/api-base.mjs";

test("uses localhost for a local browser without configuration", () => {
  assert.equal(
    getApiBase({ isBrowser: true, hostname: "localhost" }),
    "http://localhost:8000",
  );
});

test("uses same-origin /api for hosted browser requests", () => {
  assert.equal(getApiBase({ isBrowser: true, hostname: "app.example" }), "/api");
});

test("uses same-origin /api for server requests", () => {
  assert.equal(getApiBase({ isBrowser: false }), "/api");
});

test("preserves an explicitly configured API URL", () => {
  assert.equal(
    getApiBase({ configuredUrl: "https://api.example/", isBrowser: true }),
    "https://api.example",
  );
});

test("empty configured URL falls through to environment resolution", () => {
  assert.equal(
    getApiBase({ configuredUrl: "", isBrowser: true, hostname: "localhost" }),
    "http://localhost:8000",
  );
});

test("non-local browser hostnames use the same-origin proxy", () => {
  for (const hostname of ["192.168.1.10", "[IP]", "dev.local", ""]) {
    assert.equal(
      getApiBase({ isBrowser: true, hostname }),
      "/api",
      `hostname ${JSON.stringify(hostname)}`,
    );
  }
});

test("localhost variants resolve to the local backend port", () => {
  assert.equal(
    getApiBase({ isBrowser: true, hostname: "[::1]" }),
    "http://localhost:8000",
  );
});

test("configured URL wins over local browser resolution", () => {
  assert.equal(
    getApiBase({
      configuredUrl: "https://api.example/",
      isBrowser: true,
      hostname: "localhost",
    }),
    "https://api.example",
  );
});
