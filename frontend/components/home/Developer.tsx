import Link from "next/link";
import { Terminal } from "lucide-react";

// Developer section: copy and doc links on the left, a short terminal session on the right.
// Terminal lines stay short on purpose (spec §4.5) so they fit at phone width.
export default function Developer() {
  return (
    <section className="border-y-hair border-line-100 bg-bg-100">
      <div className="mx-auto flex max-w-[75rem] flex-wrap items-center gap-14 px-6 py-24">
        <div className="flex min-w-0 flex-[1_1_23.75rem] flex-col gap-5">
          <h2 className="m-0 text-balance font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            Runs where your code already runs.
          </h2>
          <p className="m-0 text-pretty text-base leading-[1.625rem] text-ink-200">
            Install the CLI as a pre-commit hook, add one step to CI, or connect the GitHub App. All three read the
            same .ferret/ rules.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className="fo-btn fo-btn--secondary h-11 no-underline">
              Quickstart
            </Link>
            <Link href="/docs" className="fo-btn fo-btn--ghost h-11 no-underline">
              CLI reference
            </Link>
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_32.5rem] overflow-hidden rounded-xl border-hair border-line-100 bg-bg-inset">
          <div className="flex items-center gap-2 border-b-hair border-line-100 px-4 py-3 font-mono text-[0.75rem] text-ink-300">
            <Terminal className="size-4" strokeWidth={1.5} aria-hidden="true" />
            terminal
          </div>
          <pre className="m-0 overflow-x-auto p-5 font-mono text-[0.8125rem] leading-[1.375rem] text-ink-200">
            <span className="text-fur-text">$</span>
            {' git commit -m "add billing config"\n'}
            <span className="text-ink-300">ferret ▸ scanning 4 staged files…</span>
            {"\n"}
            <span className="text-danger">✕ leaked</span>
            {"  STRIPE_LIVE_KEY  config.ts:18\n"}
            <span className="text-ok">✓ clean</span>
            {"   3 files\n"}
            <span className="text-ink-300">commit blocked. fix with:</span>
            {"\n  "}
            <span className="text-fur-text">$</span>
            {" ferret rotate stripe/live"}
          </pre>
        </div>
      </div>
    </section>
  );
}
