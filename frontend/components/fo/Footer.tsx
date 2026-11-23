import Link from "next/link";
import Logo from "./Logo";

// `#` entries are stub links with no target yet (spec §10): Changelog, Status, About, Contact, Privacy.
const COLUMNS: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    label: "Developers",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "CLI reference", href: "/docs" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

// Marketing footer (Footer.dc.html): brand + tagline, three link columns, © line. No status badge.
export default function Footer() {
  return (
    <footer className="border-t-hair border-line-100 bg-bg-000 font-sans text-ink-200">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-12 px-6 pb-8 pt-14">
        <div className="flex flex-wrap gap-x-16 gap-y-10">
          <div className="flex max-w-[22.5rem] flex-[2_1_17.5rem] flex-col gap-3.5">
            <Link href="/" aria-label="FerretOps home" className="flex items-center">
              <Logo size="footer" />
            </Link>
            <p className="m-0 text-sm leading-[1.375rem] text-ink-300">
              Turns compliance documents into checks that run in your code, your infra and your
              team.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav
              key={col.label}
              aria-label={col.label}
              className="flex flex-[1_1_8.75rem] flex-col gap-2.5 text-sm"
            >
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-300">
                {col.label}
              </span>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="text-ink-200 hover:text-ink-100">
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t-hair border-line-100 pt-6 text-[0.8125rem] text-ink-300">
          <span>© 2026 FerretOps</span>
        </div>
      </div>
    </footer>
  );
}
