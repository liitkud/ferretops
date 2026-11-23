import Link from "next/link";
import Logo from "@/components/fo/Logo";
import { currentUser } from "@/lib/demo-data";

// Onboarding (Onboarding.dc.html .ob): no sidebar, a slim header with the signed-in user.
// The page renders the step rail + content body below it.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fo flex min-h-screen flex-col bg-bg-000 font-sans text-ink-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-hair border-line-100 px-5 py-3 md:px-8">
        <Logo size="app" />
        <span className="text-sm text-ink-300">
          Signed in as {currentUser.email} ·{" "}
          <Link href="/sign-in" className="text-ink-200">
            Sign out
          </Link>
        </span>
      </header>
      {children}
    </div>
  );
}
