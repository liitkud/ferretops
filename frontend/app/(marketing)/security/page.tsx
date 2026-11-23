import { Lock } from "lucide-react";
import StatusWord from "@/components/fo/StatusWord";
import { marketingMetadata } from "@/components/marketing/metadata";

export const metadata = marketingMetadata({
  title: "Security",
  description:
    "FerretOps stores your uploaded documents, check results and fingerprints. Secret values never leave your infrastructure.",
  path: "/security",
});

const FLOW = {
  infra: [
    ["Repos and CI", "scan runs here"],
    ["Secret stores", "values stay here"],
  ],
  cloud: [
    ["Documents and findings", "file, line, rule"],
    ["Evidence events", "who, what, when"],
  ],
};

const PRINCIPLES = [
  [
    "We never store secret values",
    "FerretOps keeps a salted one-way fingerprint so it can recognise a key again. The value itself never leaves your runner.",
  ],
  [
    "Rotation is pass-through",
    "Rotation streams a new value from the provider to each target in memory and discards it when the job ends.",
  ],
  [
    "Least privilege by default",
    "Integrations ask for the narrowest scopes they need. Every scope is listed in the docs, with why.",
  ],
  [
    "Run it yourself",
    "Enterprise can deploy the whole stack in your own cloud, so nothing leaves your network.",
  ],
];

// Stored is a status word (spec §3): "Never" ok, "Optional" warn, plain "Yes" stays ink.
const RETENTION: { data: string; example: string; stored: React.ReactNode; retention: string }[] = [
  { data: "Uploaded documents", example: "access-control-policy.pdf", stored: "Yes", retention: "Until you delete them" },
  { data: "Secret value", example: "sk_live_51H…", stored: <StatusWord tone="ok">Never</StatusWord>, retention: "—" },
  { data: "Fingerprint", example: "sha256:9f2c…e81a", stored: "Yes", retention: "[RETENTION]" },
  { data: "Finding location", example: "billing/config.ts:18", stored: "Yes", retention: "[RETENTION]" },
  { data: "Source code", example: "3 lines of context", stored: <StatusWord tone="warn">Optional</StatusWord>, retention: "Off by default" },
  { data: "Evidence events", example: "rotation.started", stored: "Yes", retention: "Per plan" },
];

const COMPLIANCE = [
  ["SOC 2 Type II", "[STATUS]"],
  ["ISO 27001", "[STATUS]"],
  ["Penetration test", "[DATE]"],
];

const SECTION_H2 = "m-0 font-heading text-[clamp(1.625rem,2.8vw,2.25rem)] leading-[1.15] font-bold text-balance tracking-[-0.02em]";

export default function SecurityPage() {
  return (
    <main>
      <section className="mx-auto flex w-full max-w-[75rem] flex-col gap-5 px-6 pt-22 pb-16">
        <h1 className="m-0 max-w-[51.25rem] font-heading text-[clamp(2.375rem,4.6vw,3.625rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance">
          Security
        </h1>
        <p className="m-0 max-w-[40rem] text-[1.125rem] leading-7 text-pretty text-ink-200">
          FerretOps stores your uploaded documents, check results and fingerprints. Secret values never leave your
          infrastructure.
        </p>
      </section>

      {/* Data flow: two flat row lists joined by the TLS hop. */}
      <section aria-label="Data flow" className="mx-auto w-full max-w-[75rem] px-6 pb-24">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(17.5rem,100%),1fr))] items-stretch gap-4">
          <FlowPanel title="Your infrastructure" rows={FLOW.infra} />
          <div className="flex flex-col items-center justify-center gap-2.5 p-4 text-center">
            <div className="flex items-center gap-2 text-ink-300">
              <span className="h-[0.0625rem] w-12 bg-line-200" />
              <Lock aria-hidden="true" strokeWidth={1.5} className="size-4 flex-none text-ok" />
              <span className="h-[0.0625rem] w-12 bg-line-200" />
            </div>
            <span className="text-[0.8125rem] text-ink-200">TLS 1.3 · fingerprints and metadata only</span>
            <span className="fo-secret">
              <span className="fo-secret__dots">sha256:</span>
              <span className="fo-secret__tail">9f2c…e81a</span>
            </span>
          </div>
          <FlowPanel title="FerretOps cloud" rows={FLOW.cloud} />
        </div>
      </section>

      {/* Principles: divided rows, heading left and text right; wraps to stacked on phones. */}
      <section className="border-t-hair border-b-hair border-line-100 bg-bg-100">
        <div className="mx-auto flex max-w-[75rem] flex-col px-6 py-22">
          {PRINCIPLES.map(([h, p], i) => (
            <div
              key={h}
              className={`flex flex-wrap gap-x-12 gap-y-2 border-t-hair border-line-100 py-6 ${i === PRINCIPLES.length - 1 ? "border-b-hair" : ""}`}
            >
              <h2 className="m-0 flex-[1_1_17.5rem] text-[1.125rem] font-semibold">{h}</h2>
              <p className="m-0 max-w-[40rem] flex-[2_1_26.25rem] text-[0.9375rem] leading-6 text-pretty text-ink-200">
                {p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Retention table. */}
      <section className="mx-auto flex w-full max-w-[75rem] flex-col gap-7 px-6 py-22">
        <h2 className={SECTION_H2}>What we keep, and for how long</h2>
        <div className="fo-table-wrap">
          <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Data retention table">
            <table className="fo-table min-w-[42.5rem]">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Example</th>
                  <th scope="col">Stored</th>
                  <th scope="col">Retention</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION.map((r) => (
                  <tr key={r.data}>
                    <td className="text-ink-100">{r.data}</td>
                    <td className="font-mono text-[0.8125rem]">{r.example}</td>
                    <td>{r.stored}</td>
                    <td>
                      {r.retention === "—" ? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">Not applicable</span>
                        </>
                      ) : (
                        r.retention
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Compliance status and disclosure contact. Values stay placeholders until the owner confirms them. */}
      <section className="mx-auto grid w-full max-w-[75rem] grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))] gap-6 px-6 pb-28">
        <div className="fo-panel flex flex-col gap-3.5">
          <h2 className="fo-panel__title">Compliance</h2>
          <div className="flex flex-col gap-2.5 text-[0.875rem]">
            {COMPLIANCE.map(([name, value]) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <span>{name}</span>
                <StatusWord tone="info">{value}</StatusWord>
              </div>
            ))}
          </div>
          {/* TODO(owner): report request target. */}
          <a href="#" className="-my-3 inline-flex min-h-11 items-center self-start text-[0.875rem] font-medium no-underline">
            Request reports under NDA
          </a>
        </div>
        <div className="fo-panel flex flex-col gap-3.5">
          <h2 className="fo-panel__title">Report a vulnerability</h2>
          <p className="m-0 text-[0.875rem] leading-[1.375rem] text-ink-200">
            Email us with steps to reproduce. We reply within [N] business days and credit researchers who want it.
          </p>
          <span className="fo-secret self-start">
            <span className="fo-secret__tail">security@[DOMAIN]</span>
          </span>
          {/* TODO(owner): PGP key and disclosure policy target. */}
          <a href="#" className="-my-3 inline-flex min-h-11 items-center self-start text-[0.875rem] font-medium no-underline">
            PGP key and disclosure policy
          </a>
        </div>
      </section>
    </main>
  );
}

// One side of the data flow: a small uppercase label and a flat list of rows.
function FlowPanel({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="fo-panel flex flex-col gap-3.5">
      <h2 className="m-0 text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-300 uppercase">{title}</h2>
      <div className="flex flex-col border-t-hair border-line-100 text-[0.875rem]">
        {rows.map(([label, note]) => (
          <div key={label} className="flex justify-between gap-2 border-b-hair border-line-100 py-3">
            <span>{label}</span>
            <span className="font-mono text-[0.75rem] text-ink-300">{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
