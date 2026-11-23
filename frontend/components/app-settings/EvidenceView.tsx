"use client";

import Link from "next/link";
import { useState } from "react";
import AppPage from "@/components/fo/AppPage";
import AppTopBar from "@/components/fo/AppTopBar";
import StatusWord from "@/components/fo/StatusWord";
import { counts, currentUser, evidenceStatus, soc2, soc2Controls } from "@/lib/demo-data";

// Evidence (Evidence.dc.html): SOC 2 control map plus auditor access. Export shows the email confirmation.
export default function EvidenceView() {
  const [exported, setExported] = useState(false);
  const auditor = soc2.auditor;

  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Evidence" }]}>
        <button type="button" className="btn btn-p" onClick={() => setExported(true)}>
          {exported ? "Pack requested" : "Export evidence pack"}
        </button>
      </AppTopBar>
      <AppPage
        title="Evidence"
        description={`${soc2.framework} · audit window ${soc2.auditWindow}. ${counts.controlsCollected} of ${counts.controls} mapped controls have current evidence.`}
      >
        {exported && (
          <p className="note m-0" role="status">
            Building the evidence pack for {counts.controls} controls. We will email {currentUser.email} a download
            link when it is ready.
          </p>
        )}

        {/* Control → requirement → the checks/tasks that supply evidence → status */}
        <div className="tbl">
          <table className="t">
            <thead>
              <tr>
                <th scope="col">Control</th>
                <th scope="col">Requirement</th>
                <th scope="col">Collected from</th>
                <th scope="col">Evidence</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {soc2Controls.map((c) => (
                <tr key={c.id}>
                  <td className="mono whitespace-nowrap">{c.id}</td>
                  <td className="min-w-48">
                    {c.requirement}
                    <div className="mute">
                      <Link href="/documents/isp-004">{c.source}</Link>
                    </div>
                  </td>
                  <td className="mono mute min-w-48">{c.collectedFrom.join(", ")}</td>
                  <td className="mute">{c.evidence}</td>
                  <td className="whitespace-nowrap">
                    <StatusWord status={evidenceStatus[c.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="box flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 className="sec">Auditor access</h2>
            <span className="mute text-sm">
              {auditor.name} (auditor) can read evidence until {auditor.until}. Auditors cannot change checks or
              tasks.
            </span>
          </div>
          <Link className="btn btn-s" href="/settings?tab=members">
            Manage members
          </Link>
        </section>
      </AppPage>
    </>
  );
}
