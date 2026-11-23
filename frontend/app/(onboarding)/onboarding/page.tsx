import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set up your workspace" };

// TODO(onboarding): build the 4-step flow from design/project/Onboarding.dc.html (spec §5).
export default function OnboardingPage() {
  return (
    <main className="mx-auto w-full max-w-[40rem] px-5 py-12">
      <h1 className="page">Name your workspace</h1>
    </main>
  );
}
