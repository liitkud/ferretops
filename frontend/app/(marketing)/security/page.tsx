import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security" };

// TODO(marketing): build from design/project/Security.dc.html (spec §4).
export default function SecurityPage() {
  return (
    <main className="mx-auto w-full max-w-[75rem] px-6 py-16">
      <h1 className="font-heading text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em]">Security</h1>
    </main>
  );
}
