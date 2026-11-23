"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import s from "./home.module.css";

// Deferred at launch (spec §4.2): built but not rendered. When it returns it goes directly under the hero.
const NAMES = [
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Vercel",
  "Netlify",
  "AWS",
  "Google Cloud",
  "Cloudflare",
  "Kubernetes",
  "Doppler",
  "Slack",
  "Datadog",
];

// Integrations marquee: wordmarks only, 40s linear loop, pauses on hover or with the 2.75rem toggle.
// The list is doubled for a seamless loop; the copy is hidden from assistive tech.
// Under reduced motion nothing travels and the toggle is hidden (it would control nothing).
export default function Marquee() {
  const [paused, setPaused] = useState(false);
  const item = "inline-flex items-center whitespace-nowrap px-7 text-base text-ink-200";

  return (
    <section
      aria-label="Integrations"
      className={`${s.marqueeWrap} ${paused ? s.marqueePaused : ""} relative border-y-hair border-line-100 bg-bg-000 font-mono`}
    >
      <div className={`${s.marqueeMask} mr-[4.75rem] overflow-hidden py-[1.625rem]`}>
        <div className={s.marqueeTrack}>
          {NAMES.map((n) => (
            <span key={n} className={item}>
              {n}
            </span>
          ))}
          {NAMES.map((n) => (
            <span key={`dup-${n}`} className={item} aria-hidden="true">
              {n}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label="Pause integrations list"
        onClick={() => setPaused(!paused)}
        className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[0.5rem] border-hair border-line-100 bg-bg-000 text-ink-200 hover:text-ink-100 motion-reduce:hidden"
      >
        {paused ? (
          <Play className="size-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Pause className="size-4" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
