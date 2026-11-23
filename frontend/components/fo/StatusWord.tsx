import type { Status, Tone } from "@/lib/demo-data";

const TONE_CLASS: Record<Tone, string> = {
  ok: "text-ok",
  bad: "text-danger",
  warn: "text-warn",
  info: "text-info",
  mute: "text-ink-300",
};

// Status as a colored word (spec §3): never a dot alone, never a pill background.
// Pass either `status` from demo-data or `tone` + children.
export default function StatusWord({
  status,
  tone,
  children,
  className = "",
}: {
  status?: Status;
  tone?: Tone;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = status?.tone ?? tone ?? "mute";
  return <span className={`${TONE_CLASS[t]} ${className}`}>{children ?? status?.label}</span>;
}
