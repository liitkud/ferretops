import { LogoMark } from "@/components/fo/Logo";
import StatusWord from "@/components/fo/StatusWord";
import {
  codeChecks,
  evidenceStatus,
  infraChecks,
  soc2,
  soc2Controls,
  type Status,
} from "@/lib/demo-data";
import s from "./home.module.css";

export type ShotBucket = "code" | "infra" | "evidence";

type View = {
  title: string;
  action: string;
  stats: { label: string; value: string; delta: string }[];
  cols: [string, string, string, string];
  rows: { a: string; b: string; status: Status; d: string }[];
};

const pick = <T extends { id: string }>(list: T[], ids: string[]) =>
  ids.map((id) => list.find((x) => x.id === id)!);
const n = (x: number) => String(x);
const ok = (list: { status: Status }[]) => list.filter((c) => c.status.tone === "ok").length;
const bad = (list: { status: Status }[]) => list.filter((c) => c.status.tone === "bad").length;
const controls = (k: keyof typeof evidenceStatus) => soc2Controls.filter((c) => c.status === k).length;

// Layout from AppShot.dc.html; rows and numbers from the shared demo dataset (spec §1).
const VIEWS: Record<ShotBucket, View> = {
  code: {
    title: "Code checks",
    action: "Scan now",
    stats: [
      { label: "Checks", value: n(codeChecks.length), delta: "From ISP-004 v3.2" },
      { label: "Passing", value: n(ok(codeChecks)), delta: "Every commit and pull request" },
      { label: "Failing", value: n(bad(codeChecks)), delta: "1 secret, 3 CVEs" },
    ],
    cols: ["Check", "Source", "Status", "Last run"],
    rows: pick(codeChecks, [
      "no-secrets-in-repos",
      "signed-commits-main",
      "dependency-critical-cves",
      "branch-protection-main",
      "required-reviews",
    ]).map((c) => ({ a: c.id, b: `ISP-004 ${c.clause}`, status: c.status, d: c.lastRun })),
  },
  infra: {
    title: "Infra checks",
    action: "Run checks",
    stats: [
      { label: "Checks", value: n(infraChecks.length), delta: "2 AWS accounts" },
      { label: "Passing", value: n(ok(infraChecks)), delta: "Runs every hour" },
      { label: "Failing", value: n(bad(infraChecks)), delta: "stripe/live at 91 days" },
    ],
    cols: ["Check", "Source", "Status", "Last run"],
    rows: pick(infraChecks, [
      "key-rotation-90d",
      "no-open-ssh",
      "db-encryption-at-rest",
      "admin-mfa",
      "storage-block-public",
    ]).map((c) => ({ a: c.id, b: `ISP-004 ${c.clause}`, status: c.status, d: c.lastRun })),
  },
  evidence: {
    title: "Evidence",
    action: "Export pack",
    stats: [
      { label: "Controls", value: n(soc2Controls.length), delta: soc2.framework },
      { label: "Collected", value: n(controls("collected")), delta: "Current evidence" },
      { label: "Missing", value: n(controls("missing")), delta: `${controls("partial")} partial` },
    ],
    cols: ["Control", "Requirement", "Status", "Evidence"],
    rows: pick(soc2Controls, ["CC6.1", "CC6.3", "CC6.8", "CC7.2", "CC8.1"]).map((c) => ({
      a: c.id,
      b: c.requirement,
      status: evidenceStatus[c.status],
      d: c.evidence,
    })),
  },
};

const NAV: { id: ShotBucket; label: string; count: string }[] = [
  { id: "code", label: "Code", count: n(codeChecks.length) },
  { id: "infra", label: "Infra", count: n(infraChecks.length) },
  { id: "evidence", label: "Evidence", count: `${controls("collected")}/${soc2Controls.length}` },
];

// Static app screenshot for one bucket: sidebar, header, three stats, table. No browser chrome.
// Fixed 37.5rem height so swapping buckets never moves the page.
export default function AppShot({ bucket }: { bucket: ShotBucket }) {
  const v = VIEWS[bucket];
  return (
    <div className="overflow-hidden rounded-[0.875rem] border-hair border-line-100 bg-bg-000 text-left font-sans text-ink-100">
      <div className="flex h-[37.5rem] min-w-[61.25rem]">
        <div className="flex w-[13.125rem] flex-none flex-col gap-[1.125rem] border-r-hair border-line-100 bg-bg-000 px-3 py-4">
          <div className="flex items-center gap-2 px-2 font-heading text-base font-bold">
            <LogoMark className="size-[1.375rem]" />
            <span>
              Ferret<span className="text-fur-text">Ops</span>
            </span>
          </div>
          <div className="fo-nav">
            <div className="fo-nav__head">Buckets</div>
            {NAV.map((n) => (
              <span
                key={n.id}
                className={`flex h-8 items-center gap-2 rounded-md px-3 text-[0.8125rem] font-medium ${
                  n.id === bucket ? "bg-bg-200 text-ink-100" : "text-ink-200"
                }`}
              >
                {n.label}
                <span className="ml-auto font-mono text-[0.75rem] text-ink-300">{n.count}</span>
              </span>
            ))}
          </div>
          <div className="fo-nav">
            <div className="fo-nav__head">Workspace</div>
            <span className="fo-nav__item">Documents</span>
            <span className="fo-nav__item">People tasks</span>
            <span className="fo-nav__item">Repositories</span>
            <span className="fo-nav__item">Settings</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 bg-bg-000 px-7 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className={`${s.in} flex flex-col gap-0.5`}>
              <span className="text-[0.75rem] text-ink-300">acme · production</span>
              <span className="font-heading text-[1.5rem] font-bold tracking-[-0.01em]">{v.title}</span>
            </div>
            <div className="flex gap-2" aria-hidden="true">
              <span className="fo-btn fo-btn--secondary fo-btn--sm">Filter</span>
              <span className="fo-btn fo-btn--primary fo-btn--sm">{v.action}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            {v.stats.map((st, i) => (
              <div
                key={st.label}
                className={`fo-panel fo-panel--compact ${s.in}`}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="fo-stat__label">{st.label}</div>
                <div className="fo-stat__value">{st.value}</div>
                <div className="fo-stat__delta">{st.delta}</div>
              </div>
            ))}
          </div>
          <div className="fo-table-wrap">
            <table className="fo-table">
              <thead>
                <tr>
                  {v.cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {v.rows.map((r, i) => {
                  const delay = { animationDelay: `${0.35 + i * 0.12}s` };
                  return (
                    <tr key={r.a} className={s.row}>
                      <td className="fo-key" style={delay}>
                        {r.a}
                      </td>
                      <td style={delay}>{r.b}</td>
                      <td style={delay}>
                        <StatusWord status={r.status} className="text-[0.8125rem] font-medium" />
                      </td>
                      <td className="fo-muted" style={delay}>
                        {r.d}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
