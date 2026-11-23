"use client";

import { useEffect, useRef, useState } from "react";
import AppShot, { type ShotBucket } from "./AppShot";
import { useInView, useReducedMotion } from "./hooks";
import s from "./home.module.css";

const TABS: { id: ShotBucket; label: string; bar: string }[] = [
  { id: "code", label: "Code", bar: "bg-gate" },
  { id: "infra", label: "Infra", bar: "bg-cycle" },
  { id: "evidence", label: "Evidence", bar: "bg-ledger" },
];

/** Other home sections (How it works bucket links) select a tab by dispatching this event. */
export const PRODUCT_TAB_EVENT = "fo:product-tab";

// Product section: pill tabs that auto-advance every 6s (the active tab's progress bar ends → next tab).
// The first click stops auto-advance for good. All panels render into one fixed-height container.
export default function ProductTabs() {
  const [tab, setTab] = useState<ShotBucket>("code");
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const running = auto && !reduced;

  const choose = (id: ShotBucket) => {
    setTab(id);
    setAuto(false);
  };

  useEffect(() => {
    const onPick = (e: Event) => {
      setTab((e as CustomEvent<ShotBucket>).detail);
      setAuto(false);
    };
    window.addEventListener(PRODUCT_TAB_EVENT, onPick);
    return () => window.removeEventListener(PRODUCT_TAB_EVENT, onPick);
  }, []);

  const advance = () => {
    const i = TABS.findIndex((t) => t.id === tab);
    setTab(TABS[(i + 1) % TABS.length].id);
  };

  // Arrow keys move between tabs (ARIA tabs pattern).
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + TABS.length) % TABS.length;
    choose(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={ref} id="product" className="relative scroll-mt-6 overflow-hidden">
      <div className="relative mx-auto flex max-w-[75rem] flex-col items-center gap-5 px-6 pb-10 pt-28 text-center">
        <h2 className="m-0 max-w-[51.25rem] text-balance font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.03em]">
          One workspace for every requirement.
        </h2>
        <p className="m-0 max-w-[37.5rem] text-pretty text-[1.125rem] leading-7 text-ink-200">
          Each bucket gets its own view: what is failing, what is fixed, and what is waiting on someone.
        </p>
        <div
          role="tablist"
          aria-label="Buckets"
          className="mt-2 inline-flex flex-wrap justify-center gap-1 rounded-pill border-hair border-line-100 bg-bg-100 p-1"
        >
          {TABS.map((t, i) => {
            const selected = t.id === tab;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`product-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="product-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-pill border-0 px-[1.125rem] font-sans text-[0.9375rem] font-medium leading-none transition-colors duration-200 ease-out ${
                  selected ? "bg-bg-200 text-ink-100" : "bg-transparent text-ink-200 hover:text-ink-100"
                }`}
              >
                {t.label}
                {/* Track always renders; the fill only runs on the active tab while auto-advancing. */}
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-[0.125rem] w-full">
                  {selected && running && (
                    <span
                      key={tab}
                      className={`${s.tabProg} block h-full ${t.bar}`}
                      style={{ animationPlayState: inView ? "running" : "paused" }}
                      onAnimationEnd={(e) => e.target === e.currentTarget && advance()}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div
          role="tabpanel"
          id="product-panel"
          aria-labelledby={`product-tab-${tab}`}
          className="mt-8 min-h-[41.375rem] w-full max-w-[70rem]"
        >
          <AppShot key={tab} bucket={tab} />
        </div>
      </div>
    </section>
  );
}
