"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleQuestionMark,
  Code,
  FileText,
  LayoutDashboard,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Logo from "./Logo";
import { counts, currentUser, workspace } from "@/lib/demo-data";

export type AppSection = "overview" | "documents" | "checks" | "tasks" | "evidence" | "settings";

type Item = { id: AppSection | "help"; label: string; href: string; icon: LucideIcon; count?: number };

const MAIN: Item[] = [
  { id: "overview", label: "Overview", href: "/overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", href: "/documents", icon: FileText, count: counts.documents },
  { id: "checks", label: "Checks", href: "/checks", icon: Code, count: counts.checks },
  { id: "tasks", label: "People tasks", href: "/tasks", icon: Users, count: counts.tasks },
  { id: "evidence", label: "Evidence", href: "/evidence", icon: ScrollText },
];

const FOOT: Item[] = [
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  { id: "help", label: "Docs and support", href: "/docs", icon: CircleQuestionMark },
];

function sectionFromPath(path: string): AppSection | undefined {
  return [...MAIN, ...FOOT].find((i) => i.id !== "help" && (path === i.href || path.startsWith(`${i.href}/`)))
    ?.id as AppSection | undefined;
}

function NavItem({ item, current }: { item: Item; current?: AppSection }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={item.id === current ? "page" : undefined}
      className="flex min-h-11 items-center gap-2.5 rounded-[0.5rem] px-2.5 text-sm font-medium text-ink-200 hover:bg-bg-100 hover:text-ink-100 aria-[current=page]:bg-bg-200 aria-[current=page]:text-ink-100"
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-[1.125rem] flex-none" />
      <span>{item.label}</span>
      {item.count !== undefined && (
        <span className="ml-1 font-mono text-sm text-ink-300 md:ml-auto">{item.count}</span>
      )}
    </Link>
  );
}

// App sidebar (AppSidebar.dc.html). Vertical 15rem rail from 48rem up; below that a wrapping top bar
// without the workspace block and user row. `active` overrides the section detected from the URL.
export default function AppSidebar({ active }: { active?: AppSection }) {
  const pathname = usePathname();
  const current = active ?? sectionFromPath(pathname);

  return (
    <aside
      aria-label="App"
      className="flex flex-row flex-wrap items-center gap-2 border-b-hair border-line-100 bg-bg-000 px-4 py-2 font-sans text-ink-100 md:min-h-screen md:w-60 md:flex-none md:flex-col md:flex-nowrap md:items-stretch md:gap-5 md:border-b-0 md:border-r-hair md:px-3 md:py-4"
    >
      <Link
        href="/overview"
        aria-label="FerretOps overview"
        className="flex min-h-11 items-center px-2"
      >
        <Logo size="app" />
      </Link>

      <div className="hidden flex-col gap-0.5 rounded-[0.5rem] border-hair border-line-100 px-2.5 py-2 md:flex">
        <b className="text-sm font-semibold">{workspace.name}</b>
        <span className="text-sm text-ink-300">{workspace.summary}</span>
      </div>

      <nav aria-label="Workspace" className="flex flex-row flex-wrap gap-0.5 md:flex-col">
        {MAIN.map((i) => (
          <NavItem key={i.id} item={i} current={current} />
        ))}
      </nav>

      <div className="flex flex-row flex-wrap gap-0.5 md:mt-auto md:flex-col">
        {FOOT.map((i) => (
          <NavItem key={i.id} item={i} current={current} />
        ))}
        <div className="mt-2 hidden items-center gap-2.5 border-t-hair border-line-100 px-2.5 pt-3 md:flex">
          <span
            aria-hidden="true"
            className="inline-flex size-8 flex-none items-center justify-center rounded-pill bg-bg-200 text-sm font-semibold"
          >
            {currentUser.initials}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{currentUser.name}</span>
            {/* Sidebar mockup and spec §5 show "Admin" here. */}
            <span className="text-sm text-ink-300">Admin</span>
          </span>
          <Link
            href="/sign-in"
            className="ml-auto inline-flex min-h-11 items-center text-sm text-ink-300 hover:text-ink-100"
          >
            Sign out
          </Link>
        </div>
      </div>
    </aside>
  );
}
