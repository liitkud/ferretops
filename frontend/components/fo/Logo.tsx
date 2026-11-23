// FerretOps mark + wordmark, ported from the inline SVG used in every mockup.
// Visual only: wrap it in a link at the call site.

const MARK_PATH =
  "M9 23A7.5 7.5 0 0 1 22 16.5H42A7.5 7.5 0 0 1 55 23V29C55 37.5 49.5 44.5 42.5 49.5 38.5 52.3 35.5 54 32 54S25.5 52.3 21.5 49.5C14.5 44.5 9 37.5 9 29Z M12.5 28 25 25 32 30 39 25 51.5 28 49.5 35 39 37.5 32 33.5 25 37.5 14.5 35Z M28.5 44.2H35.5C36.6 44.2 37.1 45.5 36.3 46.3L33 49.4C32.4 49.9 31.6 49.9 31 49.4L27.7 46.3C26.9 45.5 27.4 44.2 28.5 44.2Z";

// nav: marketing header, footer: marketing footer, app: sidebar / auth / onboarding headers.
const SIZES = {
  nav: { mark: "size-[1.875rem]", text: "text-[1.25rem]" },
  footer: { mark: "size-[1.75rem]", text: "text-[1.25rem]" },
  app: { mark: "size-6", text: "text-[1.125rem]" },
} as const;

export type LogoSize = keyof typeof SIZES;

export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`flex-none ${className}`}>
      <path className="fill-fur" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}

export default function Logo({ size = "app" }: { size?: LogoSize }) {
  const s = SIZES[size];
  return (
    <span className="flex items-center gap-2">
      <LogoMark className={s.mark} />
      <span
        className={`font-heading font-bold leading-none tracking-[-0.01em] text-ink-100 ${s.text}`}
      >
        Ferret<span className="text-fur-text">Ops</span>
      </span>
    </span>
  );
}
