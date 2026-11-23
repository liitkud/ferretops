"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StepRail from "./StepRail";
import {
  ConnectStep,
  DocumentStep,
  REQUIREMENTS_FOUND,
  ReviewStep,
  TOTAL_PAGES,
  WorkspaceStep,
  type ConnId,
} from "./steps";

const PAGE_MS = 350;

// Onboarding flow (Onboarding.dc.html renderVals ported to hooks): 4 steps, Back / Skip / Continue.
export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Acme");
  const [connected, setConnected] = useState<Record<ConnId, boolean>>({
    github: false,
    aws: false,
    slack: false,
  });
  const [file, setFile] = useState("");
  const [page, setPage] = useState(0);
  const [run, setRun] = useState(0);

  const done = page >= TOTAL_PAGES;
  const canNext = step !== 3 || done;

  // Reading simulation: one page per tick until 12. It is state, not animation, so it
  // also runs under reduced motion (the bar just jumps instead of easing).
  useEffect(() => {
    if (!file || page >= TOTAL_PAGES) return;
    const t = setTimeout(() => setPage((p) => p + 1), PAGE_MS);
    return () => clearTimeout(t);
  }, [file, page, run]);

  function startRead(fileName: string) {
    setFile(fileName);
    setPage(0);
    setRun((r) => r + 1);
  }

  // Move focus to the new step's heading after Back / Continue / Skip (not on first render).
  const heads = useRef<(HTMLHeadingElement | null)[]>([]);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heads.current[step - 1]?.focus();
  }, [step]);
  const headRef = (i: number) => (el: HTMLHeadingElement | null) => {
    heads.current[i] = el;
  };

  const nextLabel =
    step === 3 && !done ? (file ? "Reading…" : "Upload a document to continue") : "Continue";

  // All four panels share one grid cell so the container keeps the tallest step's height.
  const panels = [
    <WorkspaceStep key="1" name={name} onName={setName} headRef={headRef(0)} />,
    <ConnectStep
      key="2"
      connected={connected}
      onConnect={(id) => setConnected((c) => ({ ...c, [id]: true }))}
      headRef={headRef(1)}
    />,
    <DocumentStep key="3" file={file} page={page} onPick={startRead} headRef={headRef(2)} />,
    <ReviewStep key="4" file={file} headRef={headRef(3)} />,
  ];

  return (
    <div className="grid flex-1 grid-cols-[minmax(0,1fr)] content-start gap-8 px-5 pt-8 pb-12 min-[56rem]:grid-cols-[16rem_minmax(0,40rem)] min-[56rem]:justify-center min-[56rem]:gap-16 min-[56rem]:px-8 min-[56rem]:pt-12 min-[56rem]:pb-16">
      <StepRail step={step} />
      <main className="flex min-w-0 flex-col gap-8">
        <div className="grid">
          {panels.map((panel, i) => (
            <section
              key={i}
              className={`col-start-1 row-start-1 min-w-0 ${i + 1 === step ? "" : "invisible"}`}
              inert={i + 1 !== step}
              aria-hidden={i + 1 !== step ? true : undefined}
              data-step={i + 1}
            >
              {panel}
            </section>
          ))}
        </div>

        {/* Screen-reader status for the reading step: start and finish only, not every page. */}
        <p className="sr-only" role="status">
          {step === 3 && file ? (done ? `Done · ${REQUIREMENTS_FOUND} requirements` : `Reading ${file}`) : ""}
        </p>

        {/* Footer nav: Back keeps its space on step 1; Skip only on step 2; Open workspace on step 4. */}
        <div className="flex flex-wrap justify-between gap-3 border-t-hair border-line-100 pt-6">
          <button
            type="button"
            className={`btn btn-g ${step === 1 ? "invisible" : ""}`}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            aria-hidden={step === 1 ? true : undefined}
            tabIndex={step === 1 ? -1 : undefined}
          >
            Back
          </button>
          <span className="ml-auto flex flex-wrap gap-2">
            {step === 2 && (
              <button type="button" className="btn btn-g" onClick={() => setStep(3)}>
                Skip for now
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                className="btn btn-p"
                disabled={!canNext}
                onClick={() => setStep((s) => Math.min(4, s + 1))}
              >
                {nextLabel}
              </button>
            ) : (
              <Link href="/overview" className="btn btn-p">
                Open workspace
              </Link>
            )}
          </span>
        </div>
      </main>
    </div>
  );
}
