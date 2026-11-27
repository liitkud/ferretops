"use client";

import { useState } from "react";
import { ArrowUpRight, Lock, RefreshCw, ScrollText, Search, type LucideIcon } from "lucide-react";
import StatusWord from "@/components/fo/StatusWord";
import { PRODUCT_TAB_EVENT } from "./ProductTabs";
import type { ShotBucket } from "./AppShot";
import { useInView, useReducedMotion } from "./hooks";
import s from "./home.module.css";

// TODO(positioning): this section still tells only the code-bucket (leaked key) story. Confirm with the owner (spec §4.4, §10).

type Step = {
  title: string;
  body: string;
  Icon: LucideIcon;
  text: string;
  fill: string;
  bucket: { label: string; tab: ShotBucket };
};

const STEPS: Step[] = [
  {
    title: "Detect",
    body: "A key lands in a diff. Ferret fingerprints it and asks the provider whether it still works.",
    Icon: Search,
    text: "text-gate",
    fill: "bg-gate",
    bucket: { label: "Code", tab: "code" },
  },
  {
    title: "Block",
    body: "The merge is held by a required check, and the owner gets the file, line and a one-click fix in Slack.",
    Icon: Lock,
    text: "text-gate",
    fill: "bg-gate",
    bucket: { label: "Code", tab: "code" },
  },
  {
    title: "Rotate",
    body: "A new credential goes to every bound service. The old one is revoked only after the new one checks out.",
    Icon: RefreshCw,
    text: "text-cycle",
    fill: "bg-cycle",
    bucket: { label: "Infra", tab: "infra" },
  },
  {
    title: "Prove",
    body: "Every step is logged with who, what and when, mapped to the control it satisfies.",
    Icon: ScrollText,
    text: "text-ledger",
    fill: "bg-ledger",
    bucket: { label: "Evidence", tab: "evidence" },
  },
];

const word = "text-[0.8125rem] font-medium";
const box = "rounded-[0.625rem] border-hair border-line-100";
const delay = (d: string) => ({ animationDelay: d });

/* ---------- Step scenes: what the right panel plays for each step ---------- */

function DetectScene() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="fo-mono text-[0.8125rem] text-ink-300">billing/config.ts</span>
        <StatusWord tone="info" className={word}>
          Scanning
        </StatusWord>
      </div>
      <pre
        className={`relative m-0 overflow-x-auto bg-bg-inset p-4 font-mono text-[0.75rem] leading-[1.375rem] text-ink-300 ${box}`}
      >
        <span className={s.scan} aria-hidden="true" />
        {"  16  import Stripe from \"stripe\"\n  17\n"}
        <span className={`${s.rowIn} inline-block bg-danger-soft text-danger`} style={delay(".6s")}>
          {"+ 18  const key = \"sk_live_51H…4f2a\""}
        </span>
        {"\n  19  export const stripe = new Stripe(key)"}
      </pre>
      <div className={`${s.rowIn} flex flex-wrap items-center gap-2`} style={delay("1.1s")}>
        <span className="fo-mono text-[0.8125rem]">STRIPE_LIVE_KEY</span>
        <StatusWord tone="bad" className={word}>
          Live
        </StatusWord>
        <span className="text-[0.8125rem] text-ink-300">verified with Stripe</span>
      </div>
    </>
  );
}

function BlockScene() {
  const checks = [
    { name: "ci / test", d: ".2s" },
    { name: "ci / lint", d: ".4s" },
  ];
  return (
    <>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold">acme/api · PR #212</span>
        <span className="text-[0.8125rem] text-ink-300">add billing config</span>
      </div>
      <div className={`overflow-hidden ${box}`}>
        {checks.map((c) => (
          <div
            key={c.name}
            className={`${s.rowIn} flex items-center gap-2.5 border-b-hair border-line-100 px-3.5 py-3`}
            style={delay(c.d)}
          >
            <StatusWord tone="ok" className={word}>
              Passed
            </StatusWord>
            <span className="fo-mono text-[0.8125rem]">{c.name}</span>
          </div>
        ))}
        <div className={`${s.rowIn} flex items-center gap-2.5 bg-danger-soft px-3.5 py-3`} style={delay(".6s")}>
          <StatusWord tone="bad" className={word}>
            Failing
          </StatusWord>
          <span className="fo-mono text-[0.8125rem]">ferret / code-checks</span>
          <span className="ml-auto text-[0.75rem] text-ink-200">Required</span>
        </div>
      </div>
      <div
        className={`${s.rowIn} flex items-start gap-2.5 bg-bg-inset px-3.5 py-3 text-[0.8125rem] leading-5 text-ink-200 ${box}`}
        style={delay("1s")}
      >
        <span className="fo-mono text-fur-text">#sec-alerts</span>
        <span>Ferret: live Stripe key in billing/config.ts:18. Merge blocked for @ops-lead.</span>
      </div>
    </>
  );
}

function RotateScene() {
  const rows = [
    { t: "New key issued", d: ".2s" },
    { t: "vercel · production", d: ".5s" },
    { t: "github-actions", d: ".8s" },
    { t: "Health checks passed", d: "1.1s" },
    { t: "Old key revoked", d: "1.4s", tail: "sk_live_••••4f2a" },
  ];
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="fo-mono text-[0.875rem]">stripe/live</span>
        <StatusWord tone="info" className={word}>
          Rotating
        </StatusWord>
      </div>
      {rows.map((r) => (
        <div key={r.t} className={`${s.rowIn} flex items-center gap-2.5`} style={delay(r.d)}>
          <StatusWord tone="ok" className={word}>
            Done
          </StatusWord>
          <span className="text-[0.875rem]">{r.t}</span>
          {r.tail && <span className="fo-mono ml-auto text-[0.75rem] text-ink-300">{r.tail}</span>}
        </div>
      ))}
    </>
  );
}

function ProveScene() {
  const log = [
    { t: "14:02:11", b: "code", c: "text-gate", e: "finding.opened", d: ".1s" },
    { t: "14:02:13", b: "code", c: "text-gate", e: "merge.blocked", d: ".3s" },
    { t: "14:05:40", b: "infra", c: "text-cycle", e: "rotation.started", d: ".5s" },
    { t: "14:06:02", b: "infra", c: "text-cycle", e: "key.revoked", d: ".7s" },
    { t: "14:06:03", b: "evidence", c: "text-ledger", e: "evidence.sealed", d: ".9s" },
  ];
  return (
    <>
      <div
        className={`overflow-x-auto whitespace-pre bg-bg-inset p-4 font-mono text-[0.75rem] leading-6 text-ink-200 ${box}`}
      >
        {log.map((l) => (
          <div key={l.t} className={s.rowIn} style={delay(l.d)}>
            <span className="text-ink-300">{l.t}</span>
            {"  "}
            <span className={l.c}>{l.b.padEnd(8)}</span>
            {"  "}
            {l.e}
          </div>
        ))}
      </div>
      <div className={`${s.rowIn} flex flex-wrap items-center justify-between gap-2.5`} style={delay("1.2s")}>
        <span className="flex items-center gap-2">
          <StatusWord tone="ok" className={word}>
            Verified
          </StatusWord>
          <span className="fo-mono text-[0.8125rem]">SOC 2 · CC7.4</span>
        </span>
        <span className="fo-btn fo-btn--secondary fo-btn--sm" aria-hidden="true">
          Export evidence
        </span>
      </div>
    </>
  );
}

const SCENES = [DetectScene, BlockScene, RotateScene, ProveScene];

// How it works: four step buttons with their own 4.5s rails on the left, the active step's scene on the right.
// The rail's animationend advances to the next step until any step is clicked.
export default function HowItWorks() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const Scene = SCENES[step];

  const openBucket = (tab: ShotBucket) => window.dispatchEvent(new CustomEvent(PRODUCT_TAB_EVENT, { detail: tab }));

  return (
    <section ref={ref} id="how" className="mx-auto flex w-full max-w-[75rem] scroll-mt-6 flex-col gap-10 px-6 pb-24 pt-16">
      <h2 className="m-0 text-balance font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        From leak to closed ticket in four steps
      </h2>
      <div className="flex flex-wrap items-stretch gap-12">
        <ol className="m-0 flex min-w-0 flex-[1_1_23.75rem] list-none flex-col gap-1 p-0">
          {STEPS.map((st, i) => {
            const on = i === step;
            return (
              <li key={st.title} className="relative pl-4">
                {/* Rail track always renders; only the active step fills. */}
                <span className={s.rail} aria-hidden="true">
                  {on && (
                    <span
                      key={step}
                      className={`${s.vprog} ${st.fill}`}
                      style={{ animationPlayState: inView || reduced ? "running" : "paused" }}
                      onAnimationEnd={(e) => {
                        if (e.target === e.currentTarget && auto && !reduced) setStep((step + 1) % STEPS.length);
                      }}
                    />
                  )}
                </span>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="how-panel"
                  onClick={() => {
                    setStep(i);
                    setAuto(false);
                  }}
                  className={`flex w-full cursor-pointer items-start gap-4 rounded-[0.875rem] border-hair py-[1.125rem] pl-5 pr-5 text-left sm:pr-24 font-sans transition-[background-color,border-color,opacity] duration-200 ease-out ${
                    on ? "border-line-100 bg-bg-100" : "border-transparent bg-transparent opacity-[0.85] hover:opacity-100"
                  }`}
                >
                  <st.Icon className={`mt-[0.0625rem] size-[1.375rem] flex-none ${st.text}`} strokeWidth={1.5} aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="text-[1.125rem] font-semibold text-ink-100">{st.title}</span>
                    <span className="text-[0.9375rem] leading-6 text-ink-200">{st.body}</span>
                  </span>
                </button>
                <a
                  href="#product"
                  onClick={() => openBucket(st.bucket.tab)}
                  className={`absolute right-2 top-2 inline-flex h-11 items-center gap-1 px-3 text-[0.8125rem] font-medium no-underline ${st.text}`}
                >
                  {st.bucket.label}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ol>

        <div
          id="how-panel"
          className="relative box-border flex min-h-[26.25rem] min-w-0 flex-[1_1_32.5rem] flex-col justify-center self-stretch overflow-hidden rounded-2xl border-hair border-line-100 bg-bg-100 p-6"
        >
          <div key={step} className={`${s.rise} flex flex-col gap-3.5`}>
            <Scene />
          </div>
        </div>
      </div>
    </section>
  );
}
