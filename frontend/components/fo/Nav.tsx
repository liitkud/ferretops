"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export type NavPage = "home" | "pricing" | "security" | "docs";

const LINKS: { id: NavPage; label: string; href: string }[] = [
  { id: "pricing", label: "Pricing", href: "/pricing" },
  { id: "security", label: "Security", href: "/security" },
  { id: "docs", label: "Docs", href: "/docs" },
];

function pageFromPath(path: string): NavPage {
  return LINKS.find((l) => path === l.href || path.startsWith(`${l.href}/`))?.id ?? "home";
}

// Marketing header (Nav.dc.html): logo, Pricing / Security / Docs, Sign in + Start free.
// `active` overrides the page detected from the URL.
export default function Nav({ active }: { active?: NavPage }) {
  const pathname = usePathname();
  const current = active ?? pageFromPath(pathname);

  return (
    <header className="border-b-hair border-line-100 bg-bg-000 font-sans text-ink-100">
      <div className="mx-auto flex max-w-[75rem] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3.5">
        <Link href="/" aria-label="FerretOps home" className="flex items-center">
          <Logo size="nav" />
        </Link>
        <nav aria-label="Primary" className="flex flex-[1_1_auto] flex-wrap gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={l.id === current ? "page" : undefined}
              className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-ink-200 hover:text-ink-100 aria-[current=page]:bg-bg-200 aria-[current=page]:text-ink-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="fo-btn fo-btn--ghost h-11">
            Sign in
          </Link>
          <Link href="/sign-in?mode=sign-up" className="fo-btn fo-btn--primary h-11">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
