import styles from "./switch.module.css";

// Layout pieces shared by the Settings tabs (Settings.dc.html .panel/.grp/.line/.lrow/.sw).

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className="flex max-w-[52rem] flex-col gap-8">{children}</div>;
}

// One titled group; groups are separated by a hairline, the last one has none.
export function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b-hair border-line-100 pb-8 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-1">
        <h2 className="sec">{title}</h2>
        {description && <p className="m-0 text-sm leading-normal text-ink-300">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// A wrapping row of fields with the action at the end, bottom-aligned.
export function Line({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-end gap-3">{children}</div>;
}

// Labelled field; `flex` overrides the default grow/basis for narrow selects.
export function Field({
  label,
  flex = "flex-[1_1_14rem]",
  children,
}: {
  label: string;
  flex?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`fld ${flex}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Box({ children }: { children: React.ReactNode }) {
  return <div className="box">{children}</div>;
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b-hair border-line-100 px-4 py-3.5 text-sm last:border-b-0">
      {children}
    </div>
  );
}

// Inline confirmation / result note. role="status" so screen readers announce it when it appears.
export function Note({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`note m-0 ${className}`} role="status">
      {children}
    </div>
  );
}

export function Switch({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.sw}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    />
  );
}
