"use client";

import Link from "next/link";
import { useState } from "react";

type Step = "ask" | "sent" | "new" | "done";

// Reset.dc.html: ask -> sent (same message either way) -> new password -> done.
export default function ResetFlow() {
  const [step, setStep] = useState<Step>("ask");

  return (
    <div className="au-col">
      {step === "ask" && (
        <>
          <div className="flex flex-col gap-2">
            <h1>Reset your password</h1>
            <p className="lead">Enter the email you sign in with. We will send a reset link.</p>
          </div>
          <div className="au-card">
            <label className="fld">
              <span>Work email</span>
              <input
                className="inp"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
              />
            </label>
            <button type="button" className="btn btn-p w" onClick={() => setStep("sent")}>
              Send reset link
            </button>
          </div>
        </>
      )}
      {step === "sent" && (
        <>
          <div className="flex flex-col gap-2">
            <h1>Check your email</h1>
            <p className="lead">
              If that address has an account, a reset link is on its way. It works once and expires
              in [N] minutes.
            </p>
          </div>
          <div className="au-card">
            <button type="button" className="btn btn-p w" onClick={() => setStep("new")}>
              I opened the link
            </button>
            <Link className="btn btn-g w" href="/sign-in">
              Back to sign in
            </Link>
          </div>
        </>
      )}
      {step === "new" && (
        <>
          <div className="flex flex-col gap-2">
            <h1>Choose a new password</h1>
            <p className="lead">You will be signed out on every other device.</p>
          </div>
          <div className="au-card">
            <label className="fld">
              <span>New password</span>
              <input className="inp" type="password" autoComplete="new-password" />
            </label>
            <span className="mute text-sm">At least 12 characters.</span>
            <label className="fld">
              <span>Confirm new password</span>
              <input className="inp" type="password" autoComplete="new-password" />
            </label>
            <button type="button" className="btn btn-p w" onClick={() => setStep("done")}>
              Save password
            </button>
          </div>
        </>
      )}
      {step === "done" && (
        <>
          <div className="flex flex-col gap-2">
            <h1>Password updated</h1>
            <p className="lead">Other sessions were signed out. Sign in with your new password.</p>
          </div>
          <div className="au-card">
            <Link className="btn btn-p w" href="/sign-in">
              Sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
