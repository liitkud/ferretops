import type { Metadata } from "next";
import SignInFlow from "@/components/auth/SignInFlow";

export const metadata: Metadata = { title: "Sign in" };

// ?mode=sign-up opens the create-account variant (spec §6, FOUNDATION start-free link).
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <SignInFlow initialMode={mode === "sign-up" ? "sign-up" : "sign-in"} />;
}
