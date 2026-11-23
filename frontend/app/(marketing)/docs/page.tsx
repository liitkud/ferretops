import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quickstart" };

// TODO(marketing): build from design/project/Docs.dc.html (spec §4).
export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-[75rem] px-6 py-16">
      <h1 className="font-heading text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em]">Quickstart</h1>
    </main>
  );
}
