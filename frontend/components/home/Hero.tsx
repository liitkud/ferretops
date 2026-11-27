import Link from "next/link";
import { ArrowRight, Code, File, Server, Users, type LucideIcon } from "lucide-react";
import s from "./home.module.css";

type HeroBucket = {
  name: string;
  Icon: LucideIcon;
  color: string;
  /** Delay for landing, count tick and requirement roll (Main.dc.html). */
  delay: string;
  count: [string, string];
  unit: string;
  req: [string, string];
  tickerDelay: string;
  log: string[];
  file: string;
  fileDelay: string;
  hlDelay: string;
  hlClass: string;
  lines: [string, string, string];
  pos: { b: string; f: string };
};

// The three buckets and the file each one writes, with per-bucket stagger copied from the mockup.
const BUCKETS: HeroBucket[] = [
  {
    name: "Code",
    Icon: Code,
    color: "text-gate",
    delay: "1.5s",
    count: ["13", "14"],
    unit: "checks",
    req: ["Signed commits on main", "No secrets in repositories"],
    tickerDelay: "0s",
    log: [
      "scanned acme/api@9f2c1e · clean",
      "scanned acme/web@41b7aa · clean",
      "acme/api PR #212 · 1 finding",
      "scanned acme/infra@07de3b · clean",
    ],
    file: ".ferret/code.yml",
    fileDelay: "2.3s",
    hlDelay: "2.4s",
    hlClass: s.hlGate,
    lines: ["- id: signed-commits", "- id: no-secrets-in-repos", "  scan: [commits, pull_requests]"],
    pos: { b: s.vizB1, f: s.vizF1 },
  },
  {
    name: "Infra",
    Icon: Server,
    color: "text-cycle",
    delay: "2.5s",
    count: ["8", "9"],
    unit: "checks",
    req: ["Encrypt production databases at rest", "Rotate production keys every 90 days"],
    tickerDelay: "0.7s",
    log: [
      "aws/prod-deploy · 34d · ok",
      "vercel/env · 6 secrets · ok",
      "openai/api · 84d · due soon",
      "stripe/live · 91d · rotating",
    ],
    file: ".ferret/infra.rego",
    fileDelay: "3.3s",
    hlDelay: "3.4s",
    hlClass: s.hlCycle,
    lines: ['deny["db not encrypted"] { … }', 'deny["key older than 90d"] {', "  key.age_days > 90 }"],
    pos: { b: s.vizB2, f: s.vizF2 },
  },
  {
    name: "People",
    Icon: Users,
    color: "text-ledger",
    delay: "3.5s",
    count: ["5", "6"],
    unit: "tasks",
    req: ["Annual security training", "Quarterly access review"],
    tickerDelay: "1.4s",
    log: [
      "@sec-lead · access review · due Dec 1",
      "@ops-lead · vendor review · done",
      "all staff · training · 18/24",
      "@it-admin · restore test · scheduled",
    ],
    file: ".ferret/tasks.yml",
    fileDelay: "4.3s",
    hlDelay: "4.4s",
    hlClass: s.hlLedger,
    lines: ["- task: security-training", "- task: access-review", "  every: quarter · owner: @sec-lead"],
    pos: { b: s.vizB3, f: s.vizF3 },
  },
];

// Wires: page → buckets, then buckets → files. pathLength=1 + dasharray "1 3" so retracting leaves nothing behind.
const WIRES_IN = [
  { d: "M0 140 C 100 140, 100 250, 200 250", stroke: "var(--cycle)", delay: "2.1s" },
  { d: "M0 258 C 100 258, 100 80, 200 80", stroke: "var(--gate)", delay: "1.1s" },
  { d: "M0 374 C 100 374, 100 420, 200 420", stroke: "var(--ledger)", delay: "3.1s" },
];
const WIRES_OUT = [
  { d: "M0 75 L200 75", stroke: "var(--gate)", delay: "1.9s" },
  { d: "M0 250 L200 250", stroke: "var(--cycle)", delay: "2.9s" },
  { d: "M0 425 L200 425", stroke: "var(--ledger)", delay: "3.9s" },
];

function Wires({ paths, className }: { paths: typeof WIRES_IN; className: string }) {
  return (
    <div className={`${s.connectors} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 500" preserveAspectRatio="none" className="block size-full overflow-visible">
        {paths.map((p) => (
          <path
            key={p.d}
            className={s.flow}
            pathLength={1}
            style={{ animationDelay: p.delay }}
            d={p.d}
            fill="none"
            stroke={p.stroke}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}

const clause = "absolute left-8 right-8 m-0 text-[0.7188rem] leading-[1.0625rem]";

// ISP-004 page 3, rotated -1.5°. Paper stays light in both themes, so its colors are literal.
function PolicyPage() {
  return (
    <div className={s.vizPage}>
      <div className="absolute inset-0 -rotate-[1.5deg] overflow-hidden rounded-[0.25rem] border-hair border-[#23262e] bg-[#fafaf8] font-[family-name:Arial,Helvetica,sans-serif] text-[#3a3d44]">
        <span className={`${s.scan} ${s.scanPage}`} aria-hidden="true" />
        <div className="absolute left-8 right-8 top-[1.125rem] flex justify-between gap-3 border-b-hair border-[#d9d9d3] pb-1.5 text-[0.5625rem] leading-[0.75rem] text-[#686b72]">
          <span>Acme Corp · Information Security Policy</span>
          <span>ISP-004 · v3.2</span>
        </div>
        <span className="absolute left-8 top-12 text-[0.875rem] font-bold text-[#16171a]">4. Access Control</span>
        <p className={`${clause} top-[4.625rem]`}>
          <b className="text-[#16171a]">4.1</b> Production access is granted on a least-privilege basis and approved by
          the system owner.
        </p>
        <p className={`${clause} top-[7.375rem]`}>
          <b className="text-[#16171a]">4.2</b> Production credentials, including API keys, database passwords and
          signing keys,{" "}
          <span className={`${s.hl} ${s.hlPageCycle} px-0.5 text-[#16171a]`} style={{ animationDelay: "1.6s" }}>
            must be rotated at least every 90 days
          </span>{" "}
          and stored in an approved secrets manager.
        </p>
        <p className={`${clause} top-[11.125rem] pl-4`}>
          (a) Service accounts are in scope.
          <br />
          (b) Each rotation is recorded in the change log.
        </p>
        <p className={`${clause} top-[14.75rem]`}>
          <b className="text-[#16171a]">4.3</b>{" "}
          <span className={`${s.hl} ${s.hlPageGate} px-0.5 text-[#16171a]`} style={{ animationDelay: "0.6s" }}>
            Secrets must never be committed to source code repositories
          </span>
          , including private repositories and commit history. Exceptions require written approval from the CISO.
        </p>
        <p className={`${clause} top-[18.75rem] pl-4`}>
          A credential found in a repository is treated as compromised and must be revoked within 24 hours.
        </p>
        <p className={`${clause} top-[22rem]`}>
          <b className="text-[#16171a]">4.4</b> Access to production systems{" "}
          <span className={`${s.hl} ${s.hlPageLedger} px-0.5 text-[#16171a]`} style={{ animationDelay: "2.6s" }}>
            must be reviewed quarterly by the system owner
          </span>
          , and unused access removed.
        </p>
        <p className={`${clause} top-[25.25rem]`}>
          <b className="text-[#16171a]">4.5</b> Accounts inactive for 90 days are disabled. Access for leavers is
          revoked by the end of their last working day.
        </p>
        <div className="absolute bottom-4 left-8 right-8 flex justify-between gap-3 border-t-hair border-[#d9d9d3] pt-1.5 text-[0.5625rem] leading-[0.75rem] text-[#686b72]">
          <span>Internal · Owner: Security · Rev. 2026-03-14</span>
          <span>Page 3 of 12</span>
        </div>
      </div>
    </div>
  );
}

// One bucket row: count ticks up, requirement rolls old → new, activity log scrolls up.
// The outgoing value of each roll is aria-hidden so screen readers get the final text once.
function BucketRow({ b }: { b: HeroBucket }) {
  const delay = { animationDelay: b.delay };
  return (
    <div
      className={`${s.land} ${s.vizB} ${b.pos.b} box-border flex flex-col gap-2 border-t-hair border-line-100 pt-[1.125rem]`}
      style={delay}
    >
      <div className="flex items-center gap-2.5">
        <b.Icon className={`size-[1.125rem] flex-none ${b.color}`} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[1.125rem] font-semibold">{b.name}</span>
        <span className="fo-mono ml-auto inline-flex items-center gap-[0.3125rem] text-[0.8125rem] text-ink-300">
          <span className={s.odo} style={delay}>
            <span aria-hidden="true">{b.count[0]}</span>
            <span className="text-ink-100">{b.count[1]}</span>
          </span>
          {b.unit}
        </span>
      </div>
      <span className={`${s.odo} ${s.reqroll}`} style={delay}>
        <span className="text-ink-300" aria-hidden="true">
          {b.req[0]}
        </span>
        <span className="text-ink-100">{b.req[1]}</span>
      </span>
      <span className={`${s.ticker} mt-auto`}>
        <span className={s.tickerTrack} style={{ animationDelay: b.tickerDelay }}>
          {b.log.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span aria-hidden="true">{b.log[0]}</span>
        </span>
      </span>
    </div>
  );
}

// The rules file a bucket writes, with its new line highlighted.
function OutputFile({ b }: { b: HeroBucket }) {
  return (
    <div
      className={`${s.land} ${s.vizF} ${b.pos.f} box-border flex flex-col gap-2.5 pt-[1.125rem]`}
      style={{ animationDelay: b.fileDelay }}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[0.8125rem] text-ink-100">
        <File className="size-4 flex-none text-ink-300" strokeWidth={1.5} aria-hidden="true" />
        {b.file}
      </span>
      <pre className="m-0 overflow-hidden rounded-[0.5rem] bg-bg-inset px-3 py-2.5 font-mono text-[0.75rem] leading-5 text-ink-300">
        {b.lines[0]}
        {"\n"}
        <span className={`${s.hl} ${b.hlClass} text-ink-100`} style={{ animationDelay: b.hlDelay }}>
          {b.lines[1]}
        </span>
        {"\n"}
        {b.lines[2]}
      </pre>
    </div>
  );
}

// Hero: headline, subhead, CTAs, then the document → buckets → files visual on one 7s loop.
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto flex max-w-[75rem] flex-col items-center gap-6 px-6 pb-24 pt-[6.5rem] text-center">
        <h1
          className={`${s.rise} m-0 max-w-[58.75rem] text-balance font-heading text-[clamp(2.625rem,6vw,4.75rem)] font-bold leading-none tracking-[-0.035em]`}
          style={{ animationDelay: "0.05s" }}
        >
          Turn compliance docs into checks that actually run.
        </h1>
        <p
          className={`${s.rise} m-0 max-w-[40rem] text-pretty text-[1.1875rem] leading-[1.875rem] text-ink-200`}
          style={{ animationDelay: "0.16s" }}
        >
          Drop in your policies, frameworks and security questionnaires. FerretOps pulls out every actionable
          requirement and sorts it into what it can scan in your code, what it can scan in your infra, and what needs
          a person.
        </p>
        <div className={`${s.rise} flex flex-wrap justify-center gap-3`} style={{ animationDelay: "0.26s" }}>
          <Link
            href="/sign-in?mode=sign-up"
            className="fo-btn fo-btn--primary h-[2.875rem] px-[1.375rem] text-[0.9375rem] no-underline"
          >
            Upload a policy
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <Link href="/docs" className="fo-btn fo-btn--secondary h-[2.875rem] px-[1.375rem] text-[0.9375rem] no-underline">
            Read the docs
          </Link>
        </div>

        <div className={`${s.mockIn} ${s.viz} mt-14 w-full max-w-[72.5rem] text-left`}>
          <PolicyPage />
          <Wires paths={WIRES_IN} className={s.vizC1} />
          {BUCKETS.map((b) => (
            <BucketRow key={b.name} b={b} />
          ))}
          <Wires paths={WIRES_OUT} className={s.vizC2} />
          {BUCKETS.map((b) => (
            <OutputFile key={b.file} b={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
