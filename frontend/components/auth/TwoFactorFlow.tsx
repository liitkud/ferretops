"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const LENGTH = 6;

// Six single-digit inputs: auto-advance, backspace steps back, paste fills all.
function CodeInputs() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => refs.current[Math.min(Math.max(i, 0), LENGTH - 1)]?.focus();

  const setDigit = (i: number, value: string) => {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((p, j) => (j === i ? d : p)));
    if (d) focus(i + 1);
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>, start: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    setDigits((prev) =>
      prev.map((_, j) => pasted[j] ?? "").concat(prev.slice(pasted.length)).slice(0, LENGTH),
    );
    focus(Math.min(start + pasted.length, LENGTH - 1));
  };

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mute mb-2 text-sm">6-digit code</legend>
      <div className="code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) {
                e.preventDefault();
                focus(i - 1);
              }
            }}
            onPaste={(e) => onPaste(e, i)}
          />
        ))}
      </div>
    </fieldset>
  );
}

// TwoFactor.dc.html: six-digit code, recovery-code fallback, support contact.
export default function TwoFactorFlow() {
  const [recovery, setRecovery] = useState(false);

  return (
    <div className="au-col">
      <div className="flex flex-col gap-2">
        <h1>Enter your code</h1>
        <p className="lead">
          Open your authenticator app and enter the 6-digit code for FerretOps.
        </p>
      </div>
      <div className="au-card">
        <CodeInputs />
        <Link className="btn btn-p w" href="/overview">
          Verify and sign in
        </Link>
        <button
          type="button"
          className="btn btn-g w"
          onClick={() => setRecovery(!recovery)}
        >
          {recovery ? "Use authenticator code" : "Use a recovery code"}
        </button>
        {recovery && (
          <label className="fld">
            <span>Recovery code</span>
            <input className="inp mono" type="text" placeholder="xxxx-xxxx" autoComplete="off" />
          </label>
        )}
      </div>
      <p className="m-0 text-center text-sm text-ink-300">
        Lost your device and codes?{" "}
        <a href="mailto:support@[DOMAIN]">Contact support</a>
      </p>
    </div>
  );
}
