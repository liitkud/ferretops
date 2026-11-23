import type { Metadata } from "next";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = { title: "Set up your workspace" };

// Onboarding (Onboarding.dc.html, spec §5): shown after sign-up, four steps, ends at /overview.
export default function OnboardingPage() {
  return <OnboardingFlow />;
}
