"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCw, ScrollText, Shield, type LucideIcon } from "lucide-react";

type Item = { label: string; href: string; current?: boolean; icon?: LucideIcon; bucket?: "gate" | "cycle" | "ledger" };

// Only Quickstart exists today. Install and Connect point at its sections; the rest are stubs.
const GROUPS: { head: string; items: Item[] }[] = [
  {
    head: "Get started",
    items: [
      { label: "Quickstart", href: "/docs", current: true },
      { label: "Install the CLI", href: "/docs#install" },
      { label: "Connect GitHub", href: "/docs#connect" },
      { label: "Concepts", href: "#" },
    ],
  },
  {
    head: "Buckets",
    items: [
      { label: "Code checks", href: "#", icon: Shield, bucket: "gate" },
      { label: "Infra checks", href: "#", icon: RefreshCw, bucket: "cycle" },
      { label: "Evidence", href: "#", icon: ScrollText, bucket: "ledger" },
    ],
  },
  {
    head: "Reference",
    items: [
      { label: "CLI commands", href: "#" },
      { label: "ferret.yml", href: "#" },
      { label: "REST API", href: "#" },
      { label: "Event schema", href: "#" },
    ],
  },
];

// Docs sidebar: the search box filters page titles; empty groups drop out and a no-match line shows.
export default function DocsSidebar() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <aside className="flex max-w-[16.25rem] flex-[1_1_13.75rem] flex-col gap-6 border-r-hair border-line-100 py-8 pr-6">
      <label className="flex flex-col gap-1.5">
        <span className="fo-field__label">Search docs</span>
        <input
          className="fo-input h-11"
          type="search"
          placeholder="e.g. rotate stripe"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <nav aria-label="Docs" className="flex flex-col gap-5">
        {groups.map((g) => (
          <div key={g.head} className="fo-nav">
            <div className="fo-nav__head px-3">{g.head}</div>
            {g.items.map((i) => {
              const Icon = i.icon;
              return (
                <Link
                  key={i.label}
                  href={i.href}
                  aria-current={i.current ? "page" : undefined}
                  className={`fo-nav__item h-11 ${i.bucket ? `fo-nav__item--${i.bucket}` : ""}`}
                >
                  {Icon && <Icon aria-hidden="true" strokeWidth={1.5} />}
                  {i.label}
                </Link>
              );
            })}
          </div>
        ))}
        {groups.length === 0 && (
          <p role="status" className="m-0 px-3 text-[0.8125rem] text-ink-300">
            No pages match &ldquo;{query.trim()}&rdquo;.
          </p>
        )}
      </nav>
    </aside>
  );
}
