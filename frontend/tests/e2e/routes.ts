// Every shipped route, shared by the smoke and accessibility specs.
export const SITE_ROUTES = [
  "/",
  "/pricing",
  "/security",
  "/docs",
  "/sign-in",
  "/sign-in?mode=sign-up",
  "/verify",
  "/reset",
  "/two-factor",
  "/onboarding",
  "/overview",
  "/documents",
  "/documents/isp-004",
  "/documents/northwind-questionnaire",
  "/documents/incident-response-plan",
  "/checks",
  "/checks?tab=infra",
  "/tasks",
  "/evidence",
  "/settings",
  "/settings?tab=account",
  "/settings?tab=workspace",
  "/settings?tab=members",
  "/settings?tab=billing",
  "/settings?tab=notifications",
  "/settings?tab=api-keys",
  "/settings?tab=integrations",
];

// Old console routes kept for URL compatibility (they call the backend on localhost:8000).
export const LEGACY_ROUTES = ["/dashboard", "/policies", "/policy", "/upload", "/validate", "/landing"];

export const NOT_FOUND_ROUTE = "/this-page-does-not-exist";
