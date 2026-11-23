export const STEP_LABELS = ["Workspace", "Connections", "First document", "Review"] as const;

// Step rail (Onboarding.dc.html aside): "Step n of 4", progress track, and the step list.
// Desktop: a vertical list with hairlines. Below 56rem it wraps into one row.
export default function StepRail({ step }: { step: number }) {
  return (
    <aside className="flex flex-col gap-4">
      <span className="text-sm text-ink-200">Step {step} of 4</span>
      <div className="h-1 overflow-hidden rounded-pill bg-line-100" aria-hidden="true">
        <span
          className="block h-full bg-fur transition-[width] duration-300 ease-out"
          style={{ width: `${step * 25}%` }}
        />
      </div>
      <ol className="m-0 flex list-none flex-row flex-wrap gap-x-4 p-0 min-[56rem]:flex-col min-[56rem]:gap-1">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const current = n === step;
          const done = n < step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className="flex justify-between gap-3 text-sm min-[56rem]:border-b-hair min-[56rem]:border-line-100 min-[56rem]:py-3"
            >
              <span className={current ? "font-semibold" : "text-ink-300"}>{label}</span>
              {(done || current) && (
                <span className={done ? "text-ok" : "text-ink-300"}>{done ? "Done" : "Current"}</span>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
