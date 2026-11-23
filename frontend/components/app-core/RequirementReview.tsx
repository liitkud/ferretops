"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import { isp004, isp004Page3Requirements, type PageRequirement, type Status } from "@/lib/demo-data";
import { SR_ONLY } from "./ui";

function statusOf(r: PageRequirement): Status {
  if (r.bucket === "none") return { label: "Ignored", tone: "mute" };
  return r.accepted ? { label: "Accepted", tone: "ok" } : { label: "Needs review", tone: "warn" };
}

// ISP-004 review (Document.dc.html): the paper page beside its requirements. Changing a bucket accepts
// that requirement; the top-bar button accepts the rest. Owns the top bar because the button shares state.
export default function RequirementReview({ paper }: { paper: React.ReactNode }) {
  const [items, setItems] = useState(isp004Page3Requirements);
  const left = items.filter((i) => !i.accepted).length;

  const setBucket = (idx: number, bucket: PageRequirement["bucket"]) =>
    setItems((prev) => prev.map((it, j) => (j === idx ? { ...it, bucket, accepted: true } : it)));
  const acceptAll = () => setItems((prev) => prev.map((it) => ({ ...it, accepted: true })));

  const r = isp004.requirements;
  return (
    <>
      <AppTopBar
        crumbs={[
          { label: "Acme", href: "/overview" },
          { label: "Documents", href: "/documents" },
          { label: isp004.title },
        ]}
      >
        <button type="button" className="btn btn-p" onClick={acceptAll} disabled={left === 0}>
          <Check aria-hidden="true" className="ic" />
          {left ? `Accept ${left} on this page` : "All accepted"}
        </button>
      </AppTopBar>
      <AppPage
        title={isp004.title}
        description={
          <>
            {isp004.code} · v{isp004.version} · {isp004.pages} pages. {r.total} requirements:{" "}
            <Link href="/checks">{r.code} code checks</Link>, <Link href="/checks?tab=infra">{r.infra} infra checks</Link>{" "}
            and <Link href="/tasks">{r.people} people tasks</Link>.
          </>
        }
      >
        <div className="grid grid-cols-1 items-start gap-6 min-[68rem]:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
          {/* Left: the page as paper */}
          <section aria-label={`Page 3 of ${isp004.pages}`} className="flex min-w-0 flex-col gap-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="font-medium">Page 3 of {isp004.pages}</span>
              <span className="mute">4. Access Control</span>
            </div>
            {paper}
          </section>

          {/* Right: one row per highlighted requirement with its status, rule id and bucket picker */}
          <section className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="sec">Requirements on this page</h2>
              <span aria-live="polite" className="mute text-sm">
                {left ? `${left} need review` : "All reviewed"}
              </span>
            </div>
            <ul className="box m-0 list-none p-0">
              {items.map((it, idx) => (
                <li
                  key={`${it.clause}-${it.rule}`}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 border-b-hair border-line-100 px-5 py-4 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_10.5rem]"
                >
                  <span className="mono mute pt-0.5 text-sm">{it.clause}</span>
                  <span className="flex flex-col gap-1 text-sm leading-normal">
                    <span>{it.text}</span>
                    <span>
                      <StatusWord status={statusOf(it)} />
                      <span className="mute"> · </span>
                      <span className="mono mute">{it.rule}</span>
                    </span>
                  </span>
                  <label className="fld col-span-full sm:col-span-1">
                    <span className={SR_ONLY}>Bucket for {it.clause}: {it.text}</span>
                    <select
                      className="inp"
                      value={it.bucket}
                      onChange={(e) => setBucket(idx, e.target.value as PageRequirement["bucket"])}
                    >
                      <option value="code">Code check</option>
                      <option value="infra">Infra check</option>
                      <option value="people">People task</option>
                      <option value="none">Not a requirement</option>
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </AppPage>
    </>
  );
}
