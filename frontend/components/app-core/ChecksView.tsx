"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import { checkSummaries, codeChecks, infraChecks } from "@/lib/demo-data";
import { SOURCE_DOC_HREF, SR_ONLY, type ChecksTab } from "./ui";

const TABS: { id: ChecksTab; label: string; rows: typeof codeChecks }[] = [
  { id: "code", label: "Code", rows: codeChecks },
  { id: "infra", label: "Infra", rows: infraChecks },
];

// Checks (Checks.dc.html): Code / Infra tabs over one shared table panel. "Run all checks" queues a run
// and every Last run becomes "just now". Owns the top bar because the run button shares state.
export default function ChecksView({ initialTab }: { initialTab: ChecksTab }) {
  const [tab, setTab] = useState<ChecksTab>(initialTab);
  const [ran, setRan] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Checks" }]}>
        <button type="button" className="btn btn-s" onClick={() => setRan(true)} disabled={ran}>
          {ran ? "Queued" : "Run all checks"}
        </button>
        <span aria-live="polite" className={SR_ONLY}>
          {ran ? "Run queued for all checks" : ""}
        </span>
      </AppTopBar>
      <AppPage
        title="Checks"
        description="Automated checks built from your documents. Each one links back to the clause it came from."
      >
        <div className="flex flex-col gap-4">
          <div className="tabs" role="tablist" aria-label="Bucket">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-controls="checks-panel"
                aria-selected={tab === t.id}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className="tab"
              >
                {t.label} <span className="mono mute">{t.rows.length}</span>
              </button>
            ))}
          </div>

          {/* One panel container for both tabs: summary line plus the checks table */}
          <div id="checks-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="flex flex-col gap-4">
            <p className="mute m-0 text-sm">{checkSummaries[tab]}</p>
            <div className="tbl">
              <table className="t">
                <thead>
                  <tr>
                    <th scope="col">Check</th>
                    <th scope="col">From</th>
                    <th scope="col">Scope</th>
                    <th scope="col">Last run</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {current.rows.map((c) => (
                    <tr key={c.id} id={c.id} className="scroll-mt-8 target:bg-bg-100">
                      <td>
                        <span className="mono block">{c.id}</span>
                        <span className="mute">{c.description}</span>
                      </td>
                      <td className="whitespace-nowrap">
                        <Link href={SOURCE_DOC_HREF}>ISP-004 {c.clause}</Link>
                      </td>
                      <td className="mute whitespace-nowrap">{c.scope}</td>
                      <td className="mute whitespace-nowrap">{ran ? "just now" : c.lastRun}</td>
                      <td className="whitespace-nowrap">
                        <StatusWord status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppPage>
    </>
  );
}
