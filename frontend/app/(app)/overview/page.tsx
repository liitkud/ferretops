import type { Metadata } from "next";
import Link from "next/link";
import { Upload } from "lucide-react";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import { activity, bucketSummary, counts, needsAttention } from "@/lib/demo-data";
import { checkHref, TONE_BG } from "@/components/app-core/ui";

export const metadata: Metadata = { title: "Overview" };

// Overview (Overview.dc.html): bucket strip, "Needs attention" table and the activity log. Links only.
export default function OverviewPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Overview" }]}>
        <Link href="/documents#upload" className="btn btn-p">
          <Upload aria-hidden="true" className="ic" />
          Upload document
        </Link>
      </AppTopBar>
      <AppPage
        title="Overview"
        description={`${counts.checks} checks and ${counts.tasks} tasks from 1 document. 1 document needs review and 1 is still being read.`}
      >
        {/* Bucket strip: one link per bucket with its total and a segmented status bar */}
        <section aria-label="Buckets" className="box grid grid-cols-1 overflow-hidden sm:grid-cols-3">
          {bucketSummary.map((b) => (
            <Link
              key={b.bucket}
              href={b.bucket === "infra" ? "/checks?tab=infra" : b.href}
              className="flex flex-col gap-3 border-b-hair focus-visible:-outline-offset-[0.25rem] border-line-100 px-6 py-5 text-ink-100 last:border-b-0 hover:bg-bg-100 hover:text-ink-100 sm:border-r-hair sm:border-b-0 sm:last:border-r-0"
            >
              <span className="text-[0.9375rem] font-semibold">{b.label}</span>
              <span className="font-heading text-[2rem] leading-none font-bold">{b.total}</span>
              <span aria-hidden="true" className="flex h-[0.375rem] gap-0.5 overflow-hidden rounded-pill bg-line-100">
                {b.parts.map((p) => (
                  <span key={p.label} className={TONE_BG[p.tone]} style={{ flex: p.count }} />
                ))}
              </span>
              <span className="text-sm">
                {b.parts.map((p, i) => (
                  <span key={p.label}>
                    {i > 0 && " · "}
                    <StatusWord tone={p.tone}>{`${p.count} ${p.label}`}</StatusWord>
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 items-start gap-6 min-[60rem]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Needs attention: failing checks, documents to review and due tasks, each linked to its page */}
          <section className="flex min-w-0 flex-col gap-3">
            <h2 className="sec">Needs attention</h2>
            <div className="tbl">
              <table className="t">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Item</th>
                    <th scope="col">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {needsAttention.map((a) => (
                    <tr key={a.item}>
                      <td className="whitespace-nowrap">
                        <StatusWord status={a.status} />
                      </td>
                      <td>
                        <Link href={a.mono ? checkHref(a.item) : a.href} className={a.mono ? "mono" : undefined}>
                          {a.item}
                        </Link>
                        <div className="mute">{a.detail}</div>
                      </td>
                      <td className="mute whitespace-nowrap">{a.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity: timestamped log of what FerretOps did, newest first */}
          <section className="flex min-w-0 flex-col gap-3">
            <h2 className="sec">Activity</h2>
            <ol className="box m-0 list-none p-0 font-mono text-sm leading-normal">
              {activity.map((e, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[4.5rem_1fr] gap-3 border-b-hair border-line-100 px-4 py-2.5 last:border-b-0 sm:grid-cols-[5.5rem_4.5rem_1fr]"
                >
                  <span className="mute">{e.time}</span>
                  <span className="mute hidden sm:inline">{e.source}</span>
                  <span>{e.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </AppPage>
    </>
  );
}
