import StatusWord from "@/components/fo/StatusWord";
import { bucketSummary } from "@/lib/demo-data";

export const TOTAL_PAGES = 12;
export const SAMPLE_FILE = "sample-security-policy.pdf";
export const REQUIREMENTS_FOUND = bucketSummary.reduce((n, b) => n + b.total, 0);

/** Live URL slug for the workspace name (same rule as the mockup). */
export function toSlug(name: string) {
  return (
    (name || "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "workspace"
  );
}

// Shared heading block. The h1 takes focus on step change so screen readers hear the new step.
function StepHead({
  title,
  sub,
  headRef,
}: {
  title: string;
  sub: React.ReactNode;
  headRef: (el: HTMLHeadingElement | null) => void;
}) {
  return (
    <div>
      <h1 className="page" tabIndex={-1} ref={headRef}>
        {title}
      </h1>
      <p className="sub">{sub}</p>
    </div>
  );
}

type HeadRef = { headRef: (el: HTMLHeadingElement | null) => void };

const optClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[0.5rem] border-hair border-line-100 px-4 text-sm";

/* ---------- Step 1: workspace name, URL slug, what to prove ---------- */

export function WorkspaceStep({
  name,
  onName,
  headRef,
}: HeadRef & { name: string; onName: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHead
        headRef={headRef}
        title="Name your workspace"
        sub="Usually your company name. Teammates join this workspace."
      />
      <label className="fld">
        <span>Company or team name</span>
        <input
          className="inp"
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          autoComplete="organization"
        />
      </label>
      <p className="m-0 text-sm text-ink-300">
        Your URL: <span className="mono text-ink-100">app.ferretops.dev/{toSlug(name)}</span>
      </p>
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 text-sm font-medium text-ink-200">
          What do you need to prove? Pick any.
        </legend>
        <label className={optClass}>
          <input type="checkbox" defaultChecked className="size-[1.125rem] accent-fur" />
          SOC 2
        </label>
        <label className={optClass}>
          <input type="checkbox" className="size-[1.125rem] accent-fur" />
          ISO 27001
        </label>
        <label className={optClass}>
          <input type="checkbox" defaultChecked className="size-[1.125rem] accent-fur" />
          Answers to customer security questionnaires
        </label>
        <label className={optClass}>
          <input type="checkbox" className="size-[1.125rem] accent-fur" />
          Our own internal policies
        </label>
      </fieldset>
    </div>
  );
}

/* ---------- Step 2: connect GitHub / AWS / Slack ---------- */

export const CONNECTIONS = [
  { id: "github", name: "GitHub", detail: "Runs code checks on repositories you pick", ok: "Connected · acme · 12 repositories" },
  { id: "aws", name: "AWS", detail: "Runs infra checks with a read-only role", ok: "Connected · 2 accounts" },
  { id: "slack", name: "Slack", detail: "Sends failing checks and due tasks to a channel", ok: "Connected · #sec-alerts" },
] as const;

export type ConnId = (typeof CONNECTIONS)[number]["id"];

export function ConnectStep({
  connected,
  onConnect,
  headRef,
}: HeadRef & { connected: Record<ConnId, boolean>; onConnect: (id: ConnId) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHead
        headRef={headRef}
        title="Connect where your checks run"
        sub="Code checks read your repositories. Infra checks read your cloud accounts through a read-only role. You can add more later in Settings."
      />
      <div className="box">
        {CONNECTIONS.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b-hair border-line-100 px-5 py-4 text-sm last:border-b-0"
          >
            <span className="flex flex-col gap-1">
              <span className="font-medium">{c.name}</span>
              <span className="text-ink-300">{c.detail}</span>
            </span>
            <span className="flex min-h-11 items-center gap-3">
              {connected[c.id] ? (
                <StatusWord tone="ok">{c.ok}</StatusWord>
              ) : (
                <>
                  <StatusWord tone="mute">Not connected</StatusWord>
                  <button
                    type="button"
                    className="btn btn-s"
                    onClick={() => onConnect(c.id)}
                    aria-label={`Connect ${c.name}`}
                  >
                    Connect
                  </button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 3: upload or sample, then the reading bar ---------- */

export function DocumentStep({
  file,
  page,
  onPick,
  headRef,
}: HeadRef & { file: string; page: number; onPick: (name: string) => void }) {
  const done = page >= TOTAL_PAGES;
  return (
    <div className="flex flex-col gap-6">
      <StepHead
        headRef={headRef}
        title="Upload your first document"
        sub="A security policy works best. FerretOps reads it and sorts each requirement into code checks, infra checks or people tasks."
      />
      <label className="relative flex flex-col items-start gap-3 rounded-[0.75rem] border-hair border-dashed border-line-200 bg-bg-100 p-6 focus-within:outline-[0.125rem] focus-within:outline-offset-[0.125rem] focus-within:outline-focus focus-within:outline-solid">
        <span className="text-[0.9375rem] font-semibold">Drop a PDF, DOCX or XLSX</span>
        <span className="text-sm text-ink-300">
          Up to [N] MB. Nothing is shared outside your workspace.
        </span>
        <span className="btn btn-s">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          Choose file
        </span>
        <input
          type="file"
          accept=".pdf,.docx,.xlsx"
          className="absolute h-[0.0625rem] w-[0.0625rem] opacity-0"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f.name);
          }}
        />
      </label>
      <div>
        <button type="button" className="btn btn-g" onClick={() => onPick(SAMPLE_FILE)}>
          Use the sample security policy instead
        </button>
      </div>
      {/* Reading box: space is reserved before a file is picked so nothing below jumps. */}
      <div
        className={`box flex flex-col gap-2.5 px-5 py-4 ${file ? "" : "invisible"}`}
        aria-hidden={file ? undefined : true}
        data-testid="reading"
      >
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span className="font-medium">{file || "your document"}</span>
          <StatusWord tone={done ? "ok" : "info"}>
            {done
              ? `Done · ${REQUIREMENTS_FOUND} requirements`
              : `Reading page ${Math.max(1, page)} of ${TOTAL_PAGES}`}
          </StatusWord>
        </div>
        <div className="h-1 overflow-hidden rounded-pill bg-line-100" aria-hidden="true">
          <span
            className={`block h-full transition-[width] duration-300 ease-out ${done ? "bg-ok" : "bg-info"}`}
            style={{ width: `${Math.round((page / TOTAL_PAGES) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 4: requirements grouped by bucket ---------- */

// Example requirements per bucket, verbatim from the mockup. Counts come from the demo dataset.
const BUCKET_EXAMPLES: Record<string, string> = {
  code: "No secrets in repositories · Commits to main are signed · main only changes through a pull request",
  infra: "Rotate production keys every 90 days · Databases encrypted at rest · Disable accounts inactive for 90 days",
  people: "Quarterly access review · Annual security training · Backup restore test",
};

export function ReviewStep({ file, headRef }: HeadRef & { file: string }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHead
        headRef={headRef}
        title={`${REQUIREMENTS_FOUND} requirements found`}
        sub={`From ${file || "your document"}. 3 of them need a quick review before they become checks. You can do that from the workspace.`}
      />
      <div className="box">
        {bucketSummary.map((b) => (
          <div
            key={b.bucket}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b-hair border-line-100 px-5 py-4 text-sm last:border-b-0 min-[40rem]:grid-cols-[8rem_3rem_minmax(0,1fr)]"
          >
            <span className="font-semibold">{b.label}</span>
            <span className="mono">{b.total}</span>
            <span className="col-span-full text-ink-300 min-[40rem]:col-span-1">
              {BUCKET_EXAMPLES[b.bucket]}
            </span>
          </div>
        ))}
      </div>
      <p className="m-0 text-sm text-ink-300">
        The first scan of your repositories and cloud accounts starts when you open the workspace.
      </p>
    </div>
  );
}
