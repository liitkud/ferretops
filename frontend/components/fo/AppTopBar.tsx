import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

// App top bar (Overview.dc.html .topbar): breadcrumbs on the left, the page's main action(s) as children.
// The last crumb is the current page and renders as ink text, not a link.
export default function AppTopBar({
  crumbs,
  children,
}: {
  crumbs: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="flex min-h-15 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-hair border-line-100 px-5 py-2 md:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-ink-300">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={`${c.label}-${i}`}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className="font-medium text-ink-100">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="text-ink-300 hover:text-ink-100">
                  {c.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
      <div className="flex flex-wrap gap-2">{children}</div>
    </header>
  );
}
