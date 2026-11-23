import Link from "next/link";

// Closing call to action: same primary action as the hero, plus pricing.
export default function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-t-hair border-line-100">
      <div className="relative mx-auto flex max-w-[47.5rem] flex-col items-center gap-5 px-6 py-30 text-center">
        <h2 className="m-0 text-balance font-heading text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
          Upload a policy and get your first checks.
        </h2>
        <p className="m-0 text-pretty text-[1.125rem] leading-7 text-ink-200">
          FerretOps reads the document and sorts every requirement into code checks, infra checks and people tasks.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/sign-in?mode=sign-up"
            className="fo-btn fo-btn--primary h-[2.875rem] px-[1.375rem] text-[0.9375rem] no-underline"
          >
            Upload a policy
          </Link>
          <Link href="/pricing" className="fo-btn fo-btn--secondary h-[2.875rem] px-[1.375rem] text-[0.9375rem] no-underline">
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
