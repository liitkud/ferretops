import { Info } from "lucide-react";
import DocsSidebar from "@/components/marketing/DocsSidebar";
import DocsToc, { type TocItem } from "@/components/marketing/DocsToc";
import { marketingMetadata } from "@/components/marketing/metadata";

export const metadata = marketingMetadata({
  title: "Quickstart",
  description:
    "Upload one policy and run its code checks on a repository. You need a GitHub account and a terminal.",
  path: "/docs",
});

const TOC: TocItem[] = [
  { id: "install", label: "Install the CLI" },
  { id: "upload", label: "Upload a policy" },
  { id: "hook", label: "Add the pre-commit hook" },
  { id: "connect", label: "Connect GitHub" },
];

const STEP_H2 = "m-0 text-[1.375rem] font-semibold";
const STEP_P = "m-0 text-[0.9375rem] leading-[1.625rem] text-pretty text-ink-200";

// Terminal block: prompt in accent, success marks in ok, output notes muted. Scrolls sideways on phones.
function Terminal({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="m-0 overflow-x-auto rounded-lg border-hair border-line-100 bg-bg-inset px-4.5 py-4 font-mono text-[0.8125rem] leading-[1.375rem] text-ink-100"
    >
      {children}
    </pre>
  );
}

const Prompt = () => <span className="text-fur-text">$</span>;
const Ok = () => <span className="text-ok">✓</span>;
const Note = ({ children }: { children: React.ReactNode }) => <span className="text-ink-300">{children}</span>;

export default function DocsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[80rem] flex-wrap gap-x-12 px-6">
      <DocsSidebar />

      <main className="flex min-w-0 flex-[999_1_35rem] flex-wrap gap-12 pt-12 pb-24">
        <article className="flex max-w-[47.5rem] min-w-0 flex-[999_1_32.5rem] flex-col gap-7">
          <div className="flex flex-col gap-3">
            <h1 className="m-0 font-heading text-[2.5rem] leading-[1.1] font-bold tracking-[-0.02em]">Quickstart</h1>
            <p className="m-0 text-[1.0625rem] leading-7 text-pretty text-ink-200">
              Upload one policy and run its code checks on a repository. You need a GitHub account and a terminal.
            </p>
          </div>

          {/* Step 1: install and sign in. */}
          <section id="install" className="flex flex-col gap-3">
            <h2 className={STEP_H2}>1. Install the CLI</h2>
            <Terminal label="Install commands">
              <Prompt /> brew install ferretops/tap/ferret{"\n"}
              <Prompt /> ferret login
            </Terminal>
          </section>

          {/* Step 2: one document in, three rules files out. */}
          <section id="upload" className="flex flex-col gap-3">
            <h2 className={STEP_H2}>2. Upload a policy</h2>
            <p className={STEP_P}>
              Point the CLI at a policy, framework or questionnaire. FerretOps reads it and writes one rules file per
              bucket into <code className="fo-mono">.ferret/</code>.
            </p>
            <Terminal label="Upload a policy">
              <Prompt /> ferret docs add policies/access-control.pdf{"\n"}
              <Ok /> <Note>14 code checks    →</Note> .ferret/code.yml{"\n"}
              <Ok /> <Note>9 infra checks    →</Note> .ferret/infra.rego{"\n"}
              <Ok /> <Note>6 people tasks    →</Note> .ferret/tasks.yml
            </Terminal>
          </section>

          {/* Step 3: local pre-commit hook. */}
          <section id="hook" className="flex flex-col gap-3">
            <h2 className={STEP_H2}>3. Add the pre-commit hook</h2>
            <p className={STEP_P}>
              Run this inside any repository. FerretOps now checks staged files against{" "}
              <code className="fo-mono">.ferret/code.yml</code> before every commit.
            </p>
            <Terminal label="Install the hook">
              <Prompt /> ferret hook install{"\n"}
              <Ok /> <Note>pre-commit hook added to .git/hooks</Note>
            </Terminal>
          </section>

          {/* Step 4: GitHub App, with the background-scan note. */}
          <section id="connect" className="flex flex-col gap-3">
            <h2 className={STEP_H2}>4. Connect GitHub</h2>
            <p className={STEP_P}>
              Install the GitHub App to scan pull requests and history. Pick only the repositories you want covered.
            </p>
            <div className="flex items-start gap-3 rounded-lg bg-info-soft px-4 py-3.5 text-[0.875rem] leading-[1.375rem] text-ink-100">
              <Info aria-hidden="true" strokeWidth={1.5} className="mt-0.75 size-4 flex-none text-info" />
              <span>The first history scan runs in the background. Findings appear in the dashboard as they come in.</span>
            </div>
          </section>

          {/* Pager. TODO(owner): Overview and Concepts pages do not exist yet. */}
          <div className="flex flex-wrap justify-between gap-3 border-t-hair border-line-100 pt-6">
            <a href="#" className="fo-btn fo-btn--ghost h-11 no-underline">
              Previous: Overview
            </a>
            <a href="#" className="fo-btn fo-btn--secondary h-11 no-underline">
              Next: Concepts
            </a>
          </div>
        </article>

        <DocsToc items={TOC} />
      </main>
    </div>
  );
}
