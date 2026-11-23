import Link from "next/link";
import PricingPlans from "@/components/marketing/PricingPlans";
import { marketingMetadata } from "@/components/marketing/metadata";

export const metadata = marketingMetadata({
  title: "Pricing",
  description:
    "Free for individuals and public repositories. Pay per developer when your team needs infra checks, people tasks and audit evidence.",
  path: "/pricing",
});

// null renders as "Not included" for screen readers and an em dash on screen.
type Cell = string | null;

const COMPARE: { group: string; rows: [string, Cell, Cell, Cell][] }[] = [
  {
    group: "Code checks",
    rows: [
      ["Pre-commit, CI and app scanning", "Public repos", "All repos", "All repos"],
      ["Merge blocking", null, "Included", "Included"],
      ["Custom detectors", "[N]", "Unlimited", "Unlimited"],
    ],
  },
  {
    group: "Infra checks",
    rows: [
      ["Manual rotation", null, "Included", "Included"],
      ["Scheduled rotation and fan-out", null, "Included", "Included"],
    ],
  },
  {
    group: "Evidence",
    rows: [
      ["Event history", "[N] days", "[N] year", "Custom"],
      ["Evidence packs", null, "SOC 2", "Any framework"],
      ["SIEM streaming", null, null, "Included"],
    ],
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Who counts as a developer?",
    a: "Anyone who pushed a commit to a connected private repository in the billing period. Reviewers and auditors are free.",
  },
  {
    q: "Does FerretOps store my secret values?",
    a: (
      <>
        No. FerretOps keeps a one-way fingerprint and the location. Rotated values go straight to your targets.
        Details on the <Link href="/security">Security page</Link>.
      </>
    ),
  },
  {
    q: "Can we self-host?",
    a: "Yes, on the Enterprise plan, as a container you run in your own cloud or data center.",
  },
  { q: "Do you offer discounts for students or nonprofits?", a: "[YOUR POLICY]" },
];

export default function PricingPage() {
  return (
    <main>
      <PricingPlans />

      {/* Compare table: plain group rows, scrolls sideways inside a relative wrapper on phones. */}
      <section className="border-t-hair border-b-hair border-line-100 bg-bg-100">
        <div className="mx-auto flex max-w-[75rem] flex-col gap-8 px-6 py-22">
          <h2 className="m-0 font-heading text-[clamp(1.625rem,2.8vw,2.25rem)] leading-[1.15] font-bold text-balance tracking-[-0.02em]">
            Compare plans
          </h2>
          <div className="fo-table-wrap bg-bg-000">
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Compare plans table">
              <table className="fo-table min-w-[42.5rem]">
                <thead>
                  <tr>
                    <th scope="col" className="w-2/5">Feature</th>
                    <th scope="col">Free</th>
                    <th scope="col">Team</th>
                    <th scope="col">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.flatMap(({ group, rows }) => [
                    <tr key={group}>
                      <td colSpan={4} className="h-9 bg-bg-100 text-[0.875rem] font-semibold text-ink-100">
                        {group}
                      </td>
                    </tr>,
                    ...rows.map(([feature, ...cells]) => (
                      <tr key={feature}>
                        <td className="text-ink-100">{feature}</td>
                        {cells.map((c, i) => (
                          <td key={i}>
                            {c ?? (
                              <>
                                <span aria-hidden="true">—</span>
                                <span className="sr-only">Not included</span>
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ: native <details>, the marker flips between + and − with the open state. */}
      <section className="mx-auto flex w-full max-w-[50rem] flex-col gap-7 px-6 pt-22 pb-28">
        <h2 className="m-0 font-heading text-[clamp(1.625rem,2.8vw,2.25rem)] leading-[1.15] font-bold text-balance tracking-[-0.02em]">
          Questions
        </h2>
        <div className="flex flex-col border-t-hair border-line-100">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b-hair border-line-100 py-2.5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[1rem] font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="text-ink-300">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="m-0 mt-1 mb-2.5 text-[0.9375rem] leading-6 text-pretty text-ink-200">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
