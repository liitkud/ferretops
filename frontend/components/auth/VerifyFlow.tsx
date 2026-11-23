"use client";

import Link from "next/link";
import { useState } from "react";

// Verify.dc.html: "Check your email". Resend invalidates the previous link.
export default function VerifyFlow() {
  const [sent, setSent] = useState(0);

  return (
    <div className="au-col">
      <div className="flex flex-col gap-2">
        <h1>Check your email</h1>
        <p className="lead">
          We sent a link to <b className="font-medium text-ink-100">maya@acme.com</b>. Open it to
          verify your address and set up your workspace.
        </p>
      </div>
      <div className="au-card">
        <Link className="btn btn-p w" href="/onboarding">
          I opened the link
        </Link>
        <button
          type="button"
          className="btn btn-s w"
          onClick={() => setSent((n) => n + 1)}
        >
          {sent ? "Sent again" : "Resend email"}
        </button>
        <span className="mute text-center text-sm">
          {sent
            ? "A new link is on its way. The old one no longer works."
            : "The link works once and expires in [N] minutes."}
        </span>
      </div>
      <p className="m-0 text-center text-sm text-ink-300">
        Wrong address? <Link href="/sign-in">Start over</Link>
      </p>
    </div>
  );
}
