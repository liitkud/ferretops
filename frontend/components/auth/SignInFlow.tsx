"use client";

import Link from "next/link";
import { useState } from "react";

// SignIn.dc.html: sign-up/sign-in toggle, OAuth, email + password. Routing per spec §6:
// OAuth sign-up -> /onboarding, OAuth sign-in -> /overview; email sign-up -> /verify,
// email sign-in -> /two-factor.
export default function SignInFlow({ initialMode }: { initialMode: "sign-up" | "sign-in" }) {
  const [signup, setSignup] = useState(initialMode === "sign-up");

  return (
    <div className="au-col">
      <div className="flex flex-col gap-2">
        <h1>{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="lead">
          {signup
            ? "Free for individuals and public repositories. No card needed."
            : "Sign in to your FerretOps workspace."}
        </p>
      </div>
      <div className="au-card">
        <Link className="btn btn-s w" href={signup ? "/onboarding" : "/overview"}>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M13 6h3a2 2 0 0 1 2 2v7" />
            <path d="M6 9v12" />
          </svg>
          Continue with GitHub
        </Link>
        <Link className="btn btn-s w" href={signup ? "/onboarding" : "/overview"}>
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M6 21V9a9 9 0 0 0 9 9" />
          </svg>
          Continue with GitLab
        </Link>
        <div className="or">or</div>
        <label className="fld">
          <span>Work email</span>
          <input className="inp" type="email" placeholder="you@company.com" autoComplete="email" />
        </label>
        <label className="fld">
          <span className="flex justify-between gap-2">
            Password
            {!signup && (
              <Link href="/reset" className="font-normal">
                Forgot password?
              </Link>
            )}
          </span>
          <input
            className="inp"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
          />
        </label>
        {signup && <span className="mute text-sm">At least 12 characters.</span>}
        <Link className="btn btn-p w" href={signup ? "/verify" : "/two-factor"}>
          {signup ? "Create account" : "Sign in"}
        </Link>
        {/* TODO: SSO has no target yet (spec §10 stub links). */}
        <a
          href="#"
          className="inline-flex min-h-[2.75rem] items-center justify-center text-center text-sm"
        >
          Use single sign-on (SSO)
        </a>
      </div>
      <p className="m-0 text-center text-sm text-ink-300">
        {signup ? "Already have an account?" : "New to FerretOps?"}{" "}
        <button
          type="button"
          onClick={() => setSignup(!signup)}
          className="inline-flex min-h-[2.75rem] cursor-pointer items-center border-0 bg-transparent px-1 [font:inherit] font-medium text-fur-text"
        >
          {signup ? "Sign in" : "Create an account"}
        </button>
      </p>
      <p className="m-0 text-center text-sm leading-normal text-ink-300">
        By continuing you agree to the{" "}
        {/* TODO: Terms and Privacy pages do not exist yet (spec §10 stub links). */}
        <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
