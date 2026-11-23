import { codeChecks, infraChecks, type Tone } from "@/lib/demo-data";

// Visually hidden but read by screen readers. Written out in rem because Tailwind's `sr-only` ships px.
export const SR_ONLY =
  "absolute h-[0.0625rem] w-[0.0625rem] overflow-hidden whitespace-nowrap [clip:rect(0_0_0_0)]";

// Bar segment fill per status tone (Overview bucket strip). "mute" uses the neutral line color, as in the mockup.
export const TONE_BG: Record<Tone, string> = {
  ok: "bg-ok",
  bad: "bg-danger",
  warn: "bg-warn",
  info: "bg-info",
  mute: "bg-line-200",
};

export type ChecksTab = "code" | "infra";

// Deep link to a check: opens the tab that holds it and scrolls to its row.
export function checkHref(id: string): string {
  if (infraChecks.some((c) => c.id === id)) return `/checks?tab=infra#${id}`;
  if (codeChecks.some((c) => c.id === id)) return `/checks#${id}`;
  return "/checks";
}

// Every check clause comes from ISP-004, so source links go to that document.
export const SOURCE_DOC_HREF = "/documents/isp-004";
