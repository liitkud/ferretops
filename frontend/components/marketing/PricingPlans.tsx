"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  audience: string;
  cta: { label: string; href: string; primary?: boolean };
  features: string[];
};

const TIERS: Record<"free" | "team" | "enterprise", Tier> = {
  free: {
    name: "Free",
    audience: "For individuals and open-source projects.",
    cta: { label: "Start free", href: "/sign-in?mode=sign-up" },
    features: [
      "Code checks on public repos",
      "CLI and pre-commit hook",
      "Live-key verification",
      "[N] days of history",
    ],
  },
  team: {
    name: "Team",
    audience: "Every bucket, for private repos and your cloud.",
    cta: { label: "Start [N]-day trial", href: "/sign-in?mode=sign-up", primary: true },
    features: [
      "Everything in Free",
      "Private repos and merge blocking",
      "Infra checks and key rotation",
      "Evidence log with SOC 2 mapping",
      "Slack review workflow",
    ],
  },
  enterprise: {
    name: "Enterprise",
    audience: "For regulated orgs and self-hosted installs.",
    // TODO(owner): sales contact target. Stub until a real address or form exists.
    cta: { label: "Talk to sales", href: "#" },
    features: [
      "Everything in Team",
      "Self-hosted or single-tenant",
      "SSO, SCIM and audit roles",
      "Custom frameworks and policies",
      "SIEM streaming and SLA",
    ],
  },
};

const TOGGLE_BTN =
  "h-11 cursor-pointer rounded-pill px-4 text-[0.875rem] font-medium leading-none text-ink-200 hover:text-ink-100 aria-pressed:bg-bg-200 aria-pressed:text-ink-100";

// Header block with the Monthly/Annual toggle, then three equal tier panels.
// Only the Team price depends on the billing period.
export default function PricingPlans() {
  const [annual, setAnnual] = useState(true);

  return (
    <>
      <section className="mx-auto flex w-full max-w-[75rem] flex-col items-center gap-5 px-6 pt-22 pb-10 text-center">
        <h1 className="m-0 font-heading text-[clamp(2.375rem,4.6vw,3.625rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance">
          Pricing
        </h1>
        <p className="m-0 max-w-[37.5rem] text-[1.125rem] leading-7 text-pretty text-ink-200">
          Free for individuals and public repositories. Pay per developer when your team needs infra checks,
          people tasks and audit evidence.
        </p>
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex gap-1 rounded-pill border-hair border-line-100 bg-bg-100 p-1"
        >
          <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)} className={TOGGLE_BTN}>
            Monthly
          </button>
          <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)} className={TOGGLE_BTN}>
            Annual · save [X]%
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[75rem] px-6 pt-6 pb-24">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(18.75rem,100%),1fr))] items-stretch gap-6">
          <TierPanel tier={TIERS.free} price={<Price amount="$0" unit="forever" />} />
          <TierPanel
            tier={TIERS.team}
            price={
              <div className="flex flex-col gap-0.5" aria-live="polite">
                <Price amount={annual ? "$[A]" : "$[M]"} unit="per developer / month" />
                <span className="text-[0.8125rem] text-ink-300">
                  {annual ? "Billed annually" : "Billed monthly, cancel anytime"}
                </span>
              </div>
            }
          />
          <TierPanel
            tier={TIERS.enterprise}
            price={
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-[2.25rem] font-bold tracking-[-0.02em]">Custom</span>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}

function Price({ amount, unit }: { amount: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono text-[2.5rem] font-medium tracking-[-0.02em]">{amount}</span>
      <span className="text-[0.875rem] text-ink-300">{unit}</span>
    </div>
  );
}

// One tier: name, audience line, price, action, then neutral checkmark list.
function TierPanel({ tier, price }: { tier: Tier; price: React.ReactNode }) {
  return (
    <article className="fo-panel flex flex-col gap-5.5">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 text-[1.25rem] font-semibold">{tier.name}</h2>
        <p className="m-0 text-[0.875rem] leading-[1.375rem] text-ink-300">{tier.audience}</p>
      </div>
      {price}
      <Link
        href={tier.cta.href}
        className={`fo-btn ${tier.cta.primary ? "fo-btn--primary" : "fo-btn--secondary"} h-11 justify-center no-underline`}
      >
        {tier.cta.label}
      </Link>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[0.875rem] text-ink-200">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 flex-none text-ink-300" />
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}
